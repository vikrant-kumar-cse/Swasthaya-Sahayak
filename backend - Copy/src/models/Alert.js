// 📁 models/Alert.js (or wherever it is)

import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    outbreak: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outbreak',
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    alertLevel: {
        type: String,
        enum: ['GREEN', 'YELLOW', 'RED'],  // ✅ FIXED
        required: true
    },
    message: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    twilioSid: String,
    sentAt: Date,
    error: String
}, {
    timestamps: true
});

alertSchema.index({ user: 1, createdAt: -1 });
alertSchema.index({ outbreak: 1 });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;