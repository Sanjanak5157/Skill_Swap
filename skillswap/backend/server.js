
// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// // Import database models
// import User from './models/User.js';
// import College from './models/College.js';
// import Skill from './models/Skill.js';
// import Course from './models/Course.js';
// import Note from './models/Note.js';
// import Project from './models/Project.js';
// import Dataset from './models/Dataset.js';
// import { promisePool } from './config/database.js';

// // Import routes
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import skillRoutes from './routes/skillRoutes.js';
// import courseRoutes from './routes/courseRoutes.js';
// import noteRoutes from './routes/noteRoutes.js';
// import projectRoutes from './routes/projectRoutes.js';
// import collegeRoutes from './routes/collegeRoutes.js';
// import datasetRoutes from './routes/datasetRoutes.js';
// import videoRoutes from './routes/videoRoutes.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Serve frontend static files
// app.use(express.static(path.join(__dirname, '../frontend')));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/skills', skillRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/notes', noteRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/colleges', collegeRoutes);
// app.use('/api/datasets', datasetRoutes);
// app.use('/api/video', videoRoutes);

// // Serve frontend for all other routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// const PORT = process.env.PORT || 5000;

// // Database initialization function
// async function initializeDatabase() {
//     console.log('🚀 Starting database initialization...');
    
//     try {
//         // Check if tables exist, create them if they don't
//         console.log('Creating tables if they don\'t exist...');
//         await User.createTable();
//         await College.createTable();
//         await Skill.createTable();
//         await Course.createTable();
//         await Note.createTable();
//         await Project.createTable();
//         await Dataset.createTable();
        
//         console.log('✅ Database initialization completed successfully!');
//         console.log('📊 All tables are ready for use.');
        
//         return true;
//     } catch (error) {
//         console.error('❌ Database initialization failed:', error);
//         return false;
//     }
// }

// // Start server
// const startServer = async () => {
//     try {
//         // Initialize database (without dropping tables)
//         const dbInitSuccess = await initializeDatabase();
        
//         if (!dbInitSuccess) {
//             console.error('❌ Failed to initialize database. Exiting...');
//             process.exit(1);
//         }
        
//         // Start the server
//         app.listen(PORT, () => {
//             console.log(`🚀 Server running on port ${PORT}`);
//             console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
//             console.log(`🔗 API available at: http://localhost:${PORT}/api`);
//         });
//     } catch (error) {
//         console.error('❌ Failed to start server:', error);
//         process.exit(1);
//     }
// };

// // startServer();
// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import http from 'http'; // Add this import
// import { promisePool } from './config/database.js';

// // Import database models
// import User from './models/User.js';
// import College from './models/College.js';
// import Skill from './models/Skill.js';
// import Course from './models/Course.js';
// import Note from './models/Note.js';
// import Project from './models/Project.js';
// import Dataset from './models/Dataset.js';
// import VideoSession from './models/VideoSession.js';
// import VideoMessage from './models/VideoMessage.js';
// import VideoRequest from './models/VideoRequest.js';

// // Import routes
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import skillRoutes from './routes/skillRoutes.js';
// import courseRoutes from './routes/courseRoutes.js';
// import noteRoutes from './routes/noteRoutes.js';
// import projectRoutes from './routes/projectRoutes.js';
// import collegeRoutes from './routes/collegeRoutes.js';
// import datasetRoutes from './routes/datasetRoutes.js';
// import videoRoutes from './routes/videoRoutes.js';
// import videoRequestRoutes from './routes/videoRequestRoutes.js';

// // Import WebSocket
// import { wss, authenticateWebSocket } from './websocket/server.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const server = http.createServer(app); // Create HTTP server

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Serve frontend static files
// app.use(express.static(path.join(__dirname, '../frontend')));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/skills', skillRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/notes', noteRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/colleges', collegeRoutes);
// app.use('/api/datasets', datasetRoutes);
// app.use('/api/video', videoRoutes);
// app.use('/api/video-requests', videoRequestRoutes);

// // Serve frontend for all other routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ 
//         success: false,
//         message: 'Something went wrong!', 
//         error: err.message 
//     });
// });

// const PORT = process.env.PORT || 5000;

// // Database initialization function
// async function initializeDatabase() {
//     console.log('🚀 Starting database initialization...');
    
//     try {
//         // Check connection
//         const [connectionTest] = await promisePool.execute('SELECT 1');
//         console.log('✅ Database connected');
        
//         // Create tables in correct order
//         console.log('Creating tables...');
        
//         // 1. Users table first (no foreign keys)
//         await User.createTable();
        
//         // 2. Colleges table (no foreign keys)
//         await College.createTable();
        
//         // 3. Skills table (references users)
//         await Skill.createTable();
        
//         // 4. Courses table (references users)
//         await Course.createTable();
        
//         // 5. Notes table (references users)
//         await Note.createTable();
        
//         // 6. Projects table (references users)
//         await Project.createTable();
        
//         // 7. Datasets table (references users)
//         await Dataset.createTable();
        
//         // 8. Video tables
//         await VideoSession.createTable();
//         await VideoMessage.createTable();
//         await VideoRequest.createTable();
        
//         console.log('✅ Database initialization completed!');
//         console.log('📊 All tables are ready.');
        
//     } catch (error) {
//         console.error('❌ Database initialization failed:', error);
//         throw error;
//     }
// }

// // Set up WebSocket server
// server.on('upgrade', (request, socket, head) => {
//     authenticateWebSocket(request, (err, user) => {
//         if (err) {
//             socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//             socket.destroy();
//             return;
//         }
        
//         wss.handleUpgrade(request, socket, head, (ws) => {
//             wss.emit('connection', ws, request, user);
//         });
//     });
// });

// // Start server
// const startServer = async () => {
//     try {
//         // Initialize database
//         await initializeDatabase();
        
//         // Start the server
//         server.listen(PORT, () => {
//             console.log(`🚀 Server running on port ${PORT}`);
//             console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
//             console.log(`🔗 WEB Application (API available at): http://localhost:${PORT}`);
//             console.log(`🎥 WebSocket server available at: ws://localhost:${PORT}`);
//         });
//     } catch (error) {
//         console.error('❌ Failed to start server:', error);
//         process.exit(1);
//     }
// };

// startServer();



import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import http from 'http';
import { promisePool } from './config/database.js';

// Import database models
import User from './models/User.js';
import College from './models/College.js';
import Skill from './models/Skill.js';
import Course from './models/Course.js';
import Note from './models/Note.js';
import Project from './models/Project.js';
import Dataset from './models/Dataset.js';
import VideoSession from './models/VideoSession.js';
import VideoMessage from './models/VideoMessage.js';
import VideoRequest from './models/VideoRequest.js';
import Notification from './models/Notification.js'; // ADD THIS

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import datasetRoutes from './routes/datasetRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import videoRequestRoutes from './routes/videoRequestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; // ADD THIS

// Import WebSocket and Scheduler
import { wss, authenticateWebSocket } from './websocket/server.js';
import schedulerService from './services/schedulerService.js'; // ADD THIS

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/video-requests', videoRequestRoutes);
app.use('/api/notifications', notificationRoutes); // ADD THIS

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!', 
        error: err.message 
    });
});

const PORT = process.env.PORT || 5000;

// Database initialization function
async function initializeDatabase() {
    console.log('🚀 Starting database initialization...');
    
    try {
        // Check connection
        const [connectionTest] = await promisePool.execute('SELECT 1');
        console.log('✅ Database connected');
        
        // Create tables in correct order
        console.log('Creating tables...');
        
        // 1. Users table first (no foreign keys)
        await User.createTable();
        
        // 2. Colleges table (no foreign keys)
        await College.createTable();
        
        // 3. Skills table (references users)
        await Skill.createTable();
        
        // 4. Courses table (references users)
        await Course.createTable();
        
        // 5. Notes table (references users)
        await Note.createTable();
        
        // 6. Projects table (references users)
        await Project.createTable();
        
        // 7. Datasets table (references users)
        await Dataset.createTable();
        
        // 8. Video tables
        await VideoSession.createTable();
        await VideoMessage.createTable();
        await VideoRequest.createTable();
        
        // 9. Notifications table - ADD THIS
        await Notification.createTable();
        
        console.log('✅ Database initialization completed!');
        console.log('📊 All tables are ready.');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

// WebSocket Upgrade Handler
server.on('upgrade', (request, socket, head) => {
    authenticateWebSocket(request, (err, user) => {
        if (err) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, user);
        });
    });
});

// Start server
const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();
        
        // Initialize scheduler service - ADD THIS
        await schedulerService.initialize();
        
        // Start the server
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
            console.log(`🔗 API available at: http://localhost:${PORT}/api`);
            console.log(`🎥 WebSocket server available at: ws://localhost:${PORT}`);
            console.log(`⏰ Scheduler service initialized`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();