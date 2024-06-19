const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Ongoing', 'Paused', 'Completed'], default: 'Pending' },
    duration: { type: Number, default: 0 }, // in seconds
    logs: [
        {
            action: { type: String, enum: ['Start', 'Pause', 'Resume', 'End'], required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Activity', activitySchema);
