import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import multer from "multer";
import { analyzeImageForWishes } from "../services/geminiService";
import axios from "axios";
import { createTripoTask, getTripoTask } from "../services/tripoService";

import Submission from "../models/Submission";
import cloudinary from "../config/cloudinary";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * Process a test submission scan via Gemini AI
 */
export const processSubmission = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No document provided for scanning." });
        }

        const aiResult = await analyzeImageForWishes(
            req.file.buffer,
            req.file.mimetype
        );

        res.json({
            success: true,
            data: aiResult,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error during AI analysis.",
        });
    }
};

/**
 * Trigger AI 3D Reward Generation
 */
export const generateReward = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "No reward description provided." });
        }

        const taskId = await createTripoTask(prompt);

        res.json({
            success: true,
            taskId: taskId,
            message: "Reward fabrication initiated.",
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Check status of 3D reward generation
 */
export const checkRewardStatus = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const result = await getTripoTask(taskId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Manually approve a submission and save its reward (Educator Action)
 */
export const approveSubmission = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorized access." });
        }

        const { username, content, performanceScore, integrityLevel, status, modelUrl, imageUrl } =
            req.body;

        let uploadedImageUrl = imageUrl;
        if (imageUrl && !imageUrl.includes("res.cloudinary.com")) {
            try {
                const uploadRes = await cloudinary.uploader.upload(imageUrl, {
                    folder: "edu_submissions",
                });
                uploadedImageUrl = uploadRes.secure_url;
            } catch (err: any) {
                console.error("Cloudinary sync failed", err);
            }
        }

        const newSubmission = await Submission.create({
            userId: authReq.user.uid,
            username,
            content,
            performanceScore,
            integrityLevel,
            status,
            modelUrl,
            imageUrl: uploadedImageUrl,
        });

        res.json({
            success: true,
            data: newSubmission,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get all submissions for the current student
 */
export const getSubmissions = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorized access." });
        }

        const submissions = await Submission.find({
            userId: authReq.user.uid,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Get single submission details
 */
export const getSubmissionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findById(id);

        if (!submission) {
            return res
                .status(404)
                .json({ success: false, error: "Submission registry not found." });
        }

        res.json({
            success: true,
            data: submission,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Educator Admin: Fetch pending verification queue
 */
export const getEducatorQueue = async (req: Request, res: Response) => {
    try {
        const submissions = await Submission.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: submissions,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Educator Admin: Update submission status
 */
export const updateSubmissionStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "approved", "denied"].includes(status)) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid status parameters." });
        }

        const updatedSubmission = await Submission.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedSubmission) {
            return res
                .status(404)
                .json({ success: false, error: "Submission reference not found." });
        }

        res.json({
            success: true,
            data: updatedSubmission,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Proxy GLB model streams (Security & CORS handling)
 */
export const proxyModel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findById(id);

        if (!submission || !submission.modelUrl) {
            return res.status(404).send("Model asset not found.");
        }

        const response = await axios.get(submission.modelUrl, {
            responseType: "arraybuffer",
        });

        res.setHeader(
            "Content-Type",
            response.headers["content-type"] || "model/gltf-binary"
        );
        res.send(response.data);
    } catch (error: any) {
        console.error("Proxy error:", error.message);
        res.status(500).send("Error streaming model asset.");
    }
};

/**
 * Proxy raw Tripo URLs
 */
export const proxyRawModel = async (req: Request, res: Response) => {
    try {
        const { url } = req.query;

        if (!url || typeof url !== 'string') {
            return res.status(400).send("No URL provided");
        }

        const allowedDomains = ['tripo3d.com', 'tripo-data.rg1.data.tripo3d.com'];
        try {
            const parsedUrl = new URL(url);
            const isAllowed = allowedDomains.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith('.' + d));
            if (!isAllowed) return res.status(403).send("Domain proxy restricted.");
        } catch (e) {
            return res.status(400).send("Invalid URL");
        }

        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });

        res.setHeader(
            "Content-Type",
            response.headers["content-type"] || "model/gltf-binary"
        );
        res.send(response.data);
    } catch (error: any) {
        console.error("Raw Proxy error:", error.message);
        res.status(500).send("Error proxying asset store.");
    }
};
