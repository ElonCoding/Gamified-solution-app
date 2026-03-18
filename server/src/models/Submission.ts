import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    wish: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    imageUrl: {
        type: String,
        required: true
    },
    modelUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
