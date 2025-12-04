// // // import User from '../models/User.js';
// // // import Skill from '../models/Skill.js';
// // // import Course from '../models/Course.js';
// // // import Note from '../models/Note.js';
// // // import Project from '../models/Project.js';
// // // import College from '../models/College.js';
// // // import Dataset from '../models/Dataset.js';

// // // async function initializeDatabase() {
// // //     console.log('🚀 Starting database initialization...');
    
// // //     try {
// // //         // Create all tables
// // //         await User.createTable();
// // //         await Skill.createTable();
// // //         await Course.createTable();
// // //         await Note.createTable();
// // //         await Project.createTable();
// // //         await College.createTable();
// // //         await Dataset.createTable();
        
// // //         console.log('✅ Database initialization completed successfully!');
// // //         console.log('📊 All tables are ready for use.');
        
// // //     } catch (error) {
// // //         console.error('❌ Database initialization failed:', error);
// // //         process.exit(1);
// // //     }
// // // }

// // // // Run initialization
// // // initializeDatabase();
// // import User from '../models/User.js';
// // import Skill from '../models/Skill.js';
// // import Course from '../models/Course.js';
// // import Note from '../models/Note.js';
// // import Project from '../models/Project.js';
// // import College from '../models/College.js';
// // import Dataset from '../models/Dataset.js';

// // async function initializeDatabase() {
// //     console.log('🚀 Starting database initialization...');
    
// //     try {
// //         // Create all tables
// //         await User.createTable();
// //         await Skill.createTable();
// //         await Course.createTable();
// //         await Note.createTable();
// //         await Project.createTable();
// //         await College.createTable();
// //         await Dataset.createTable();
        
// //         console.log('✅ Database initialization completed successfully!');
// //         console.log('📊 All tables are ready for use.');
        
// //     } catch (error) {
// //         console.error('❌ Database initialization failed:', error);
// //         process.exit(1);
// //     }
// // }

// // // Run initialization
// // initializeDatabase();
// import User from '../models/User.js';
// import Skill from '../models/Skill.js';
// import Course from '../models/Course.js';
// import Note from '../models/Note.js';
// import Project from '../models/Project.js';
// import College from '../models/College.js';
// import Dataset from '../models/Dataset.js';
// import { promisePool } from '../config/database.js';

// async function initializeDatabase() {
//     console.log('🚀 Starting database initialization...');
    
//     try {
//         // Drop all tables if they exist (for clean start)
//         console.log('Dropping existing tables...');
//         await promisePool.execute('DROP TABLE IF EXISTS datasets, projects, notes, courses, skills, users, colleges');
        
//         // Create all tables in correct order
//         console.log('Creating tables...');
//         await User.createTable();
//         await College.createTable();
//         await Skill.createTable();
//         await Course.createTable();
//         await Note.createTable();
//         await Project.createTable();
//         await Dataset.createTable();
        
//         console.log('✅ Database initialization completed successfully!');
//         console.log('📊 All tables are ready for use.');
        
//     } catch (error) {
//         console.error('❌ Database initialization failed:', error);
//         process.exit(1);
//     }
// }

// // Run initialization
// initializeDatabase();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import database models
import User from './models/User.js';
import Skill from './models/Skill.js';
import Course from './models/Course.js';
import Note from './models/Note.js';
import Project from './models/Project.js';
import College from './models/College.js';
import Dataset from './models/Dataset.js';
import { promisePool } from './config/database.js';

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

// Initialize dotenv first
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Database initialization function
async function initializeDatabase() {
    console.log('🚀 Starting database initialization...');
    
    try {
        // Create all tables in correct order
        console.log('Creating tables...');
        await User.createTable();
        await College.createTable();
        await Skill.createTable();
        await Course.createTable();
        await Note.createTable();
        await Project.createTable();
        await Dataset.createTable();
        
        console.log('✅ Database initialization completed successfully!');
        console.log('📊 All tables are ready for use.');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Start server with database initialization
const startServer = async () => {
    try {
        // Initialize database
        await initializeDatabase();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
            console.log(`🔗 API available at: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();