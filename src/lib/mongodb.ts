import mongoose from 'mongoose';

// Cache the connection promise to prevent multiple simultaneous connection attempts
let cachedConnection: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  console.log('[DB] Checking database connection status...');

  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    console.log('[DB] Already connected to MongoDB.');
    return mongoose.connection;
  }

  // If a connection is already in progress, wait for it
  if (cachedConnection) {
    console.log('[DB] Connection already in progress, waiting...');
    return cachedConnection;
  }

  // Validate URI - read at runtime, not import time
  const MONGODB_URI = process.env.MONGODB_URI;
  console.log('[DB] MONGODB_URI from env:', MONGODB_URI ? 'set' : 'not set');
  if (!MONGODB_URI) {
    const errorMsg = 'MONGODB_URI is missing from environment variables. Please set it in the Settings menu.';
    console.error(`[DB] CRITICAL ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  console.log('[DB] Initiating new MongoDB connection...');
  
  // Set connection options for stability
  const options = {
    bufferCommands: true, // Allow commands to be buffered while connecting
    autoIndex: true,      // Build indexes
  };

  try {
    cachedConnection = mongoose.connect(MONGODB_URI, options);
    
    await cachedConnection;
    
    console.log('[DB] MongoDB Connected successfully.');
    console.log(`[DB] Host: ${mongoose.connection.host}`);
    console.log(`[DB] Database: ${mongoose.connection.name}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error);
    cachedConnection = null; // Reset cache on failure so we can retry
    throw error;
  }
}
