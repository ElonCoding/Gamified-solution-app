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
import { verifyAuthToken } from '../middleware/auth';

const router = express.Router();

// Student Endpoints
router.post('/', verifyAuthToken, upload.single('image'), processSubmission);
router.post('/generate', verifyAuthToken, generateReward);
router.get('/status/:taskId', verifyAuthToken, checkRewardStatus);
router.post('/approve', verifyAuthToken, approveSubmission);
router.get('/wishes', verifyAuthToken, getSubmissions);
router.get('/wishes/:id', verifyAuthToken, getSubmissionById);

// Educator Admin Endpoints
router.get('/educator/submissions', getEducatorQueue);
router.put('/educator/update/:id', updateSubmissionStatus);

// Asset Proxying
router.get('/model-proxy/:id', proxyModel);
router.get('/raw-proxy', proxyRawModel);

export default router;
