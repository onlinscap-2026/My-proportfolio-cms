import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Github, ExternalLink, Mail, MapPin, Calendar, Briefcase, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackActivity } from '../lib/analytics';
import { useSettings } from '../context/SettingsContext';
import AnimatedProfileImage from '../components/AnimatedProfileImage';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

interface Experience {
  _id: string;
  company: string;
  title: string;
  duration: string;
  description: string;
}

interface Resume {
  fileUrl: string;
  fileName: string;
}

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: string;
}

interface Education {
  _id: string;
  institution: string;
  degree: string;
  year: string;
}

export default function Home() {
  const { settings } = useSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackActivity('PAGE_VIEW', 'HOME');
    const fetchData = async () => {
      try {
        const [projectsRes, expRes, resumeRes, skillsRes, educationRes] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/experience'),
          axios.get('/api/resume'),
          axios.get('/api/skills'),
          axios.get('/api/education')
        ]);
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data.slice(0, 3) : []);
        setExperience(Array.isArray(expRes.data) ? expRes.data : []);
        setResume(resumeRes.data);
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
        setEducation(Array.isArray(educationRes.data) ? educationRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section id="about" className="relative flex min-h-[80vh] items-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto flex w-full max-w-7xl items-center gap-16"
        >
          {/* Full Name on the Left - Half Width */}
          <div className="flex w-1/2 flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
              </span>
              Available for new opportunities
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              {settings?.fullName || 'Building digital'} <br />
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                {settings?.jobTitle || 'experiences'}
              </span> {settings?.fullName ? '' : 'that matter.'}
            </h1>

            <p className="max-w-2xl text-lg text-secondary-theme sm:text-xl">
              {settings?.bio || "I'm a Full Stack Engineer specializing in building high-performance web applications with modern technologies. Focused on clean code and exceptional user experiences."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/projects"
                className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-orange-500 hover:text-white"
              >
                View My Work
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-theme bg-card-theme px-8 py-4 text-sm font-semibold text-theme transition-all hover:border-neutral-700 hover:bg-neutral-800"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Profile Image on the Right - Half Width */}
          <div className="flex w-1/2 items-center justify-center">
            {settings?.profileImage && (
              <AnimatedProfileImage
                src={settings.profileImage}
                alt={settings.fullName}
                size="lg"
              />
            )}
          </div>
        </motion.div>

        {/* Background Decoration */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]"></div>
      </section>

      {/* Experience Summary Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-8 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-900/50 p-8 sm:p-12">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Professional Journey</h2>
                <p className="text-neutral-400">A quick overview of my career milestones.</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/experience"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-orange-600"
                >
                  <Briefcase size={18} />
                  View Full Experience
                </Link>
                {resume && (
                  <a
                    href={resume.fileUrl}
                    download={resume.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-theme bg-card-theme px-6 py-3 text-sm font-bold text-theme transition-all hover:border-neutral-700 hover:bg-neutral-800"
                  >
                    <Download size={18} />
                    Download Resume
                  </a>
                )}
              </div>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">{experience.length}+</div>
                <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">Roles Held</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {experience.length > 0 ? experience[0].duration.split(' - ')[0] : 'N/A'}
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">Started Career</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">Commitment</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8 flex flex-col justify-center text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Latest Role</h3>
            {experience.length > 0 ? (
              <div className="space-y-1">
                <p className="font-bold text-orange-500">{experience[0].title}</p>
                <p className="text-sm text-neutral-400">{experience[0].company}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No experience listed yet.</p>
            )}
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Projects</h2>
            <p className="text-neutral-400">A selection of my recent work and personal experiments.</p>
          </div>
          <Link to="/projects" className="hidden text-sm font-medium text-orange-500 hover:underline sm:block">
            View all projects
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-2xl bg-neutral-900"></div>
            ))
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <motion.div
                key={project._id}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 transition-all hover:border-neutral-700 hover:bg-neutral-900"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <p className="line-clamp-2 text-sm text-neutral-400">{project.description}</p>
                  <div className="flex items-center gap-4 pt-2">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:underline">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-white">
                        <Github size={14} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              No projects found. Add some in the dashboard.
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Experience</h2>
          <p className="mt-4 text-neutral-400">My professional journey and the companies I've worked with.</p>
        </div>

        <div className="space-y-8">
          {loading ? (
            [1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral-900"></div>
            ))
          ) : experience.length > 0 ? (
            experience.map((exp, index) => (
              <div key={exp._id} className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-neutral-800">
                <div className="absolute left-[-4px] top-0 h-2 w-2 rounded-full bg-orange-500"></div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                    <span className="text-sm font-medium text-orange-500">{exp.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                    <Briefcase size={14} />
                    {exp.company}
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-400">{exp.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-neutral-500">No experience data available.</div>
          )}
        </div>
      </section>

      {/* Skills & Education Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Skills & Education</h2>
          <p className="mt-4 text-neutral-400">A comprehensive overview of my technical expertise and educational background.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Technical Skills Overview */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Technical Skills</h3>
                <p className="text-sm text-neutral-400">Core competencies & technologies</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-300">Total Skills</span>
                  <span className="text-lg font-bold text-orange-500">{skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-300">Categories</span>
                  <span className="text-lg font-bold text-orange-500">
                    {skills.length > 0 ? [...new Set(skills.map(skill => skill.category))].length : 0}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-300">Avg Proficiency</span>
                  <span className="text-lg font-bold text-orange-500">
                    {skills.length > 0 ? Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length) : 0}%
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${skills.length > 0 ? Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length) : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {skills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white">Skill Proficiency Levels</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {skills.slice(0, 8).map((skill) => (
                      <div key={skill._id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300 truncate">{skill.name}</span>
                          <span className="text-orange-500 font-medium">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-orange-400 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-white mb-3">Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.slice(0, 6).map((skill) => (
                    <span key={skill._id} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                      {skill.name}
                    </span>
                  ))
                ) : (
                  ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express', 'Tailwind'].map((skill) => (
                    <span key={skill} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Education Overview */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Education</h3>
                <p className="text-sm text-neutral-400">Academic qualifications & degrees</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-300">Degrees Earned</span>
                <span className="text-lg font-bold text-orange-500">{education.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-300">Latest Degree</span>
                <span className="text-lg font-bold text-orange-500">
                  {education.length > 0 ? education[0].year : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-300">Institutions</span>
                <span className="text-lg font-bold text-orange-500">
                  {education.length > 0 ? [...new Set(education.map(edu => edu.institution))].length : 0}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-white mb-3">Education History</h4>
              <div className="space-y-3">
                {education.length > 0 ? (
                  education.slice(0, 3).map((edu) => (
                    <div key={edu._id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-white">{edu.degree}</span>
                        <span className="text-neutral-400 ml-2">• {edu.institution}</span>
                      </div>
                      <span className="text-orange-500 font-medium">{edu.year}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-400">No education data available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section (Static for now, but could be dynamic) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-8 sm:p-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Technical Skills</h2>
              <p className="text-neutral-400">
                I use a wide range of tools and technologies to build modern web applications. 
                Always learning and staying up-to-date with the latest industry trends.
              </p>
              <div className="flex flex-wrap gap-3">
                {skills.length > 0 ? (
                  skills.slice(0, 12).map((skill) => (
                    <span key={skill._id} className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                      {skill.name}
                    </span>
                  ))
                ) : (
                  ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion', 'Docker', 'AWS', 'Git'].map((skill) => (
                    <span key={skill} className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-orange-500 p-8 text-black">
                <div className="text-4xl font-black">5+</div>
                <div className="mt-2 font-bold uppercase tracking-wider text-sm">Years Experience</div>
              </div>
              <div className="rounded-2xl bg-white p-8 text-black">
                <div className="text-4xl font-black">20+</div>
                <div className="mt-2 font-bold uppercase tracking-wider text-sm">Projects Completed</div>
              </div>
              <div className="col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
                <div className="text-4xl font-black text-white">100%</div>
                <div className="mt-2 font-bold uppercase tracking-wider text-sm text-neutral-400">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
