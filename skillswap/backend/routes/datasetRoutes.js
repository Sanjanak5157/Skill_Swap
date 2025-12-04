import express from 'express';
import { 
    getDatasets, 
    getUserDatasets, 
    createDataset, 
    searchDatasets,
    downloadDataset 
} from '../controllers/datasetController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getDatasets);
router.get('/search', searchDatasets);
router.post('/:id/download', downloadDataset);

// Protected routes
router.get('/my-datasets', authMiddleware, getUserDatasets);
router.post('/', authMiddleware, createDataset);

export default router;