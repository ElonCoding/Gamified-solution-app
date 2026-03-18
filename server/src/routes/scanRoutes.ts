import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth";
import { processScan, upload, generateToy, checkToyStatus, approveWish, getSubmissions, getSubmissionById, getEducatorQueue, updateSubmissionStatus, proxyModel, proxyRawModel } from "../controllers/scanController";


const router = Router();

router.post("/", verifyAuthToken, upload.single("image"), processScan);
router.post("/generate", verifyAuthToken, generateToy);
router.get("/status/:taskId", verifyAuthToken, checkToyStatus);
router.post("/approve", verifyAuthToken, approveWish);
router.get("/submissions", verifyAuthToken, getSubmissions);
router.get("/submissions/:id", verifyAuthToken, getSubmissionById);
router.get("/model-proxy/:id", proxyModel);
router.get("/model-proxy-raw", proxyRawModel);


router.get("/educator/submissions", getEducatorQueue);
router.put("/educator/update/:id", updateSubmissionStatus);

export default router;
