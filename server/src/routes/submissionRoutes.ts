import express from 'express';
import { 
    upload, 
    processSubmission, 
    generateReward, 
    checkRewardStatus, 
    approveSubmission, 
    getSubmissions, 
    getSubmissionById, 
    getEducatorQueue, 
    updateSubmissionStatus,
    proxyModel,
    proxyRawModel
} from '../controllers/submissionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Student Endpoints
router.post('/', authenticate, upload.single('image'), processSubmission);
router.post('/generate', authenticate, generateReward);
router.get('/status/:taskId', authenticate, checkRewardStatus);
router.post('/approve', authenticate, approveSubmission);
router.get('/wishes', authenticate, getSubmissions);
router.get('/wishes/:id', authenticate, getSubmissionById);

// Educator Admin Endpoints
router.get('/educator/submissions', getEducatorQueue);
router.put('/educator/update/:id', updateSubmissionStatus);

// Asset Proxying
router.get('/model-proxy/:id', proxyModel);
router.get('/raw-proxy', proxyRawModel);

export default router;
