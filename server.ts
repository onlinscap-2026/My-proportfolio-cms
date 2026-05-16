import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import { connectDB } from './src/lib/mongodb.ts';
import { Project } from './src/models/Project.ts';
import { Experience } from './src/models/Experience.ts';
import { Education } from './src/models/Education.ts';
import { Message } from './src/models/Message.ts';
import { User } from './src/models/User.ts';
import { Resume } from './src/models/Resume.ts';
import { ActivityLog } from './src/models/ActivityLog.ts';
import { Analytics } from './src/models/Analytics.ts';
import { Settings } from './src/models/Settings.ts';
import { Skill } from './src/models/Skill.ts';
import { About } from './src/models/About.ts';

dotenv.config({ path: '.env.local' });
dotenv.config();

console.log('MONGODB_URI after dotenv:', process.env.MONGODB_URI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to database. Server will start but API routes will fail.', error);
  }

  const app = express();
  const PORT = 3002;

  app.use(cors());
  app.use(express.json());

  // Configure Multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.svg'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG, SVG are allowed.'));
      }
    }
  });

  // Serve uploads statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

  // Database Connection Check Middleware
  const checkDB = (req: any, res: any, next: any) => {
    const state = mongoose.connection.readyState;
    const states: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    };

    if (state !== 1) {
      if (req.method === 'GET') {
        console.warn(`[API] Proceeding with ${req.method} ${req.originalUrl} - DB State: ${states[state] || state}`);
        next();
        return;
      }
      console.warn(`[API] Blocked request: ${req.method} ${req.originalUrl} - DB State: ${states[state] || state}`);
      return res.status(503).json({ 
        message: 'Database connection is not ready.',
        status: states[state] || state,
        hint: !process.env.MONGODB_URI ? 'MONGODB_URI is missing' : 'Wait a few seconds and try again'
      });
    }
    next();
  };

  // API Logging
  app.use('/api', checkDB, (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.originalUrl}`);
    next();
  });

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };

  // RBAC Middleware
  const authorize = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      const userRole = req.user?.role || 'admin'; // Fallback to admin for older tokens
      if (!req.user || !roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      next();
    };
  };

  // Activity Logger Helper
  const logActivity = async (user: string, action: string, targetType: string, targetId?: string, details?: string) => {
    try {
      await ActivityLog.create({ user, action, targetType, targetId, details });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  // Settings Initialization
  const initSettings = async () => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      console.log('Skipping settings initialization: DB not connected');
      return;
    }
    try {
      const count = await Settings.countDocuments();
      if (count === 0) {
        await Settings.create({});
        console.log('Default settings initialized');
      }
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  };
  await initSettings();

  // --- API ROUTES ---

  // Auth Routes
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      let user = await (User as any).findOne({ username });
      
      // Initial setup: if no user exists, create one with the password from env
      if (!user && username === 'admin') {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
        user = await User.create({ username: 'admin', password: hashedPassword });
      }

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, username: user.username, role: user.role || 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      
      await logActivity(user.username, 'LOGIN', 'AUTH', user._id.toString(), 'User logged in');
      
      res.json({ token, username: user.username, role: user.role || 'admin', theme: user.theme || 'dark' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/user/theme', authenticate, async (req, res) => {
    const { theme } = req.body;
    try {
      await (User as any).findByIdAndUpdate((req as any).user.id, { theme });
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: 'Error updating theme preference' });
    }
  });

  // File Upload Route
  app.post('/api/upload', authenticate, upload.single('file'), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl, fileName: req.file.originalname });
  });

  // Projects
  app.get('/api/projects', async (req, res) => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.json([]);
    }
    try {
      console.log('[API] Fetching projects from database...');
      const projects = await Project.find().sort({ createdAt: -1 });
      console.log(`[API] Successfully fetched ${projects.length} projects.`);
      res.json(projects);
    } catch (error: any) {
      console.error('[API] Error fetching projects:', error);
      res.status(500).json({ 
        message: 'Error fetching projects', 
        error: error.message 
      });
    }
  });

  app.post('/api/projects', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      const project = await Project.create(req.body);
      await logActivity((req as any).user.username, 'CREATE', 'PROJECT', project._id.toString(), `Created project: ${project.title}`);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: 'Error creating project' });
    }
  });

  app.put('/api/projects/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      const project = await (Project as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      await logActivity((req as any).user.username, 'UPDATE', 'PROJECT', req.params.id, `Updated project: ${project.title}`);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: 'Error updating project' });
    }
  });

  app.delete('/api/projects/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      await (Project as any).findByIdAndDelete(req.params.id);
      await logActivity((req as any).user.username, 'DELETE', 'PROJECT', req.params.id, 'Deleted project');
      res.json({ message: 'Project deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting project' });
    }
  });

  // Experience
  app.get('/api/experience', async (req, res) => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.json([]);
    }
    try {
      const exp = await Experience.find().sort({ order: 1 });
      res.json(exp);
    } catch (error: any) {
      console.error('Error fetching experience:', error);
      res.status(500).json({ 
        message: 'Error fetching experience', 
        error: error.message 
      });
    }
  });

  app.post('/api/experience', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      const exp = await Experience.create(req.body);
      await logActivity((req as any).user.username, 'CREATE', 'EXPERIENCE', exp._id.toString(), `Created experience: ${exp.title} at ${exp.company}`);
      res.status(201).json(exp);
    } catch (error) {
      console.error('Error creating experience:', error);
      res.status(400).json({ message: 'Error creating experience' });
    }
  });

  app.put('/api/experience/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      const exp = await (Experience as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!exp) return res.status(404).json({ message: 'Experience not found' });
      await logActivity((req as any).user.username, 'UPDATE', 'EXPERIENCE', req.params.id, `Updated experience: ${exp.title}`);
      res.json(exp);
    } catch (error) {
      console.error('Error updating experience:', error);
      res.status(400).json({ message: 'Error updating experience' });
    }
  });

  app.delete('/api/experience/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      await (Experience as any).findByIdAndDelete(req.params.id);
      await logActivity((req as any).user.username, 'DELETE', 'EXPERIENCE', req.params.id, 'Deleted experience');
      res.json({ message: 'Experience deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting experience' });
    }
  });

  // Education
  app.get('/api/education', async (req, res) => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.json([]);
    }
    try {
      const edu = await Education.find();
      res.json(edu);
    } catch (error: any) {
      console.error('Error fetching education:', error);
      res.status(500).json({ 
        message: 'Error fetching education', 
        error: error.message 
      });
    }
  });

  app.post('/api/education', authenticate, async (req, res) => {
    try {
      const edu = await Education.create(req.body);
      res.status(201).json(edu);
    } catch (error) {
      console.error('Error creating education:', error);
      res.status(400).json({ message: 'Error creating education' });
    }
  });

  app.put('/api/education/:id', authenticate, async (req, res) => {
    try {
      const edu = await (Education as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!edu) return res.status(404).json({ message: 'Education not found' });
      res.json(edu);
    } catch (error) {
      console.error('Error updating education:', error);
      res.status(400).json({ message: 'Error updating education' });
    }
  });

  app.delete('/api/education/:id', authenticate, async (req, res) => {
    try {
      await (Education as any).findByIdAndDelete(req.params.id);
      res.json({ message: 'Education deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting education' });
    }
  });

  // About Me
  app.get('/api/about', async (req, res) => {
    try {
      const about = await About.find().sort({ order: 1 });
      res.json(about);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching about content' });
    }
  });

  app.post('/api/about', authenticate, async (req, res) => {
    try {
      const about = await About.create(req.body);
      res.status(201).json(about);
    } catch (error) {
      res.status(400).json({ message: 'Error creating about content' });
    }
  });

  app.put('/api/about/:id', authenticate, async (req, res) => {
    try {
      const about = await About.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(about);
    } catch (error) {
      res.status(400).json({ message: 'Error updating about content' });
    }
  });

  app.delete('/api/about/:id', authenticate, async (req, res) => {
    try {
      await About.findByIdAndDelete(req.params.id);
      res.json({ message: 'About content deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting about content' });
    }
  });

  // Contact / Messages
  app.post('/api/contact', async (req, res) => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.status(503).json({ message: 'Service unavailable - database not connected' });
    }
    try {
      const message = await Message.create(req.body);
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error sending message' });
    }
  });

  app.get('/api/messages', authenticate, async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.json(messages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ 
        message: 'Error fetching messages', 
        error: error.message 
      });
    }
  });

  // Resume
  app.get('/api/resume', async (req, res) => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.json(null);
    }
    try {
      const resume = await Resume.findOne().sort({ updatedAt: -1 });
      res.json(resume);
    } catch (error: any) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ message: 'Error fetching resume' });
    }
  });

  app.post('/api/resume', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      // We only keep one resume record, or update the latest one
      let resume = await Resume.findOne();
      if (resume) {
        resume.fileUrl = req.body.fileUrl;
        resume.fileName = req.body.fileName;
        resume.updatedAt = new Date();
        await resume.save();
        await logActivity((req as any).user.username, 'UPDATE', 'RESUME', resume._id.toString(), 'Updated resume');
      } else {
        resume = await Resume.create(req.body);
        await logActivity((req as any).user.username, 'CREATE', 'RESUME', resume._id.toString(), 'Created initial resume');
      }
      res.status(201).json(resume);
    } catch (error) {
      console.error('Error saving resume:', error);
      res.status(400).json({ message: 'Error saving resume' });
    }
  });

  app.delete('/api/resume/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      await (Resume as any).findByIdAndDelete(req.params.id);
      await logActivity((req as any).user.username, 'DELETE', 'RESUME', req.params.id, 'Deleted resume');
      res.json({ message: 'Resume deleted' });
    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(400).json({ message: 'Error deleting resume' });
    }
  });

  // Skills
  app.get('/api/skills', async (req, res) => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.json([]);
    }
    try {
      const skills = await Skill.find().sort({ order: 1, name: 1 });
      res.json(skills);
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
  });

  app.post('/api/skills', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      const skill = await Skill.create(req.body);
      await logActivity((req as any).user.username, 'CREATE', 'SKILL', skill._id.toString(), `Created skill: ${skill.name}`);
      res.status(201).json(skill);
    } catch (error) {
      console.error('Error creating skill:', error);
      res.status(400).json({ message: 'Error creating skill' });
    }
  });

  app.put('/api/skills/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      const skill = await (Skill as any).findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!skill) return res.status(404).json({ message: 'Skill not found' });
      await logActivity((req as any).user.username, 'UPDATE', 'SKILL', req.params.id, `Updated skill: ${skill.name}`);
      res.json(skill);
    } catch (error) {
      console.error('Error updating skill:', error);
      res.status(400).json({ message: 'Error updating skill' });
    }
  });

  app.delete('/api/skills/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      await (Skill as any).findByIdAndDelete(req.params.id);
      await logActivity((req as any).user.username, 'DELETE', 'SKILL', req.params.id, 'Deleted skill');
      res.json({ message: 'Skill deleted' });
    } catch (error) {
      console.error('Error deleting skill:', error);
      res.status(400).json({ message: 'Error deleting skill' });
    }
  });

  // --- ANALYTICS & LOGS ROUTES ---

  app.get('/api/admin/logs', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching logs' });
    }
  });

  app.get('/api/admin/analytics', authenticate, authorize(['admin', 'editor']), async (req, res) => {
    try {
      const analytics = await Analytics.find();
      const stats = {
        projects: await Project.countDocuments(),
        experience: await Experience.countDocuments(),
        messages: await Message.countDocuments(),
        views: analytics.filter(a => a.type === 'PAGE_VIEW'),
        clicks: analytics.filter(a => a.type === 'PROJECT_CLICK')
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching analytics' });
    }
  });

  app.post('/api/analytics/track', async (req, res) => {
    const state = mongoose.connection.readyState;
    if (state !== 1) {
      return res.json({ success: true });
    }
    const { type, identifier } = req.body;
    try {
      await (Analytics as any).findOneAndUpdate(
        { type, identifier },
        { $inc: { count: 1 }, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: 'Error tracking analytics' });
    }
  });

  // Settings
  app.route('/api/settings')
    .get(async (req, res) => {
      const state = mongoose.connection.readyState;
      if (state !== 1) {
        return res.json({});
      }
      try {
        const settings = await Settings.findOne();
        res.json(settings);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
      }
    })
    .post(authenticate, authorize(['admin']), async (req, res) => {
      try {
        const settings = await (Settings as any).findOneAndUpdate({}, req.body, { new: true, upsert: true });
        await logActivity((req as any).user.username, 'UPDATE', 'SETTINGS', settings._id.toString(), 'Updated website settings');
        res.json(settings);
      } catch (error) {
        console.error('Error updating settings:', error);
        res.status(400).json({ message: 'Error updating settings' });
      }
    });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { port: 24679 } },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    //console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Server running on https://my-proportfolio-cms.vercel.app/api:${PORT}`);
  });                       
}

startServer();
