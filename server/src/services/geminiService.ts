import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || "");

/**
 * Validates and extracts educational content from student test submissions
 */
export const analyzeImageForWishes = async (imageBuffer: Buffer, mimeType: string) => {

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are an advanced Educational OCR AI for an automated proctoring & reward system. 
            Analyze this image of a handwritten test solution or student work.
            
            Extract the following information:
            1. The name of the student (look for headers, signatures, or "Name: [Name]"). If unknown, return "Anonymous Student".
            2. The core "content" or subject matter found in the text.
            3. The performanceScore - A estimated score (0-100) based on the quality/completeness of the work shown.
            4. The integrityLevel - Evaluate if the work looks original or has signs of tampering (return "verified", "flagged", or "suspicious").

            Return ONLY a valid JSON object with the following structure:
            {
                "personName": "string",
                "content": "string",
                "performanceScore": number,
                "integrityLevel": "string",
                "confidence": number (0-1)
            }
            Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
        `;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);

    } catch (error: any) {
        throw new Error(`Failed to analyze academic document with AI: ${error.message || error}`);
    }
};
