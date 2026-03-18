# Gamified Test Series App (Hackathon Transformation)

A premium, modern, and secure educational platform that transforms test-taking into a gamified experience with AI-powered proctoring and 3D Augmented Reality (AR) rewards.

## 🚀 The Transformation
This project was originally a Christmas-themed app. It has been completely refactored into a sleek, institutional platform for educators and students. 

### Key Overhauls:
- **Visuals**: Replaced festive themes with a high-fidelity "Cyber-Institutional" design system (Slate-950, Indigo-600, Amber-500).
- **Core Logic**: Purged all "Santa", "Wish", and "Elf" terminology. Replaced with "Educator", "Submission", and "Proctoring".
- **AI Pipeline**: Realigned Gemini AI from reading Santa letters to performing OCR and integrity analysis on academic submissions.

## 🛠 Features

### 1. 🎓 Student Console
- **Secure Test Environment**: Randomized test logic with anti-cheating UI proctoring.
- **Academic OCR**: Capture student work and use Gemini AI to evaluate performance and integrity.
- **3D Reward Generation**: Successfully completed tests trigger an AI pipeline that materializes a 3D reward (using Tripo3D).
- **Academic Registry (Trophy Room)**: A persistent vault for earned 3D rewards.

### 2. 🏛 Educator Governance
- **Class Analytics Dashboard**: Real-time overview of student submissions and performance.
- **Verification Registry**: A secure queue for educators to review, approve, or reject student submissions.
- **Comm-Link (Chat Hub)**: Real-time, authenticated student-teacher communication via WebSockets.

### 3. 👓 High-Fidelity AR
- **WebXR Integration**: View earned 3D rewards in the real world using institutional AR projection.
- **3D Model Proxying**: Secure, authenticated streaming of 3D assets.

## 💻 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion, Three.js (@react-three/fiber).
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), Socket.io.
- **AI/Cloud**: Google Gemini 2.0 Flash, Tripo3D API, Cloudinary.

## 📥 Getting Started

### 1. Environment Configuration
Create a `.env` in the `server` directory:
```env
PORT=8080
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_google_ai_key
TRIPO_API_KEY=your_tripo_3d_key
CLOUDINARY_URL=your_cloudinary_url
```

### 2. Installation
```bash
# Install dependencies (Legacy peer deps required for some 3D libs)
npm install --legacy-peer-deps
```

### 3. Development
```bash
# Start Backend
cd server && npm run dev

# Start Frontend
cd client && npm run dev
```

## 📜 Usage Guidelines
- **Students**: Log in to take tests and earn 3D rewards.
- **Educators**: Navigate to `/educator/login` (Admin: `educator@inst.com` / `admin_secure_2026`) to manage the class.
