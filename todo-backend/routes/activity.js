const express = require('express');
const Activity = require('../models/Activity');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    try {
        const activity = new Activity({ userId: req.user, name });
        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user });
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { action } = req.body;
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        if (action === 'Start' || action === 'Resume') {
            const ongoingActivity = await Activity.findOne({ userId: req.user, status: 'Ongoing' });
            if (ongoingActivity) return res.status(400).json({ message: 'An activity is already ongoing' });
        }

        activity.logs.push({ action });
        switch (action) {
            case 'Start':
                activity.status = 'Ongoing';
                break;
            case 'Pause':
                activity.status = 'Paused';
                break;
            case 'Resume':
                activity.status = 'Ongoing';
                break;
            case 'End':
                activity.status = 'Completed';
                break;
        }
        await activity.save();
        res.status(200).json(activity);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

///////
router.put("/:id/duration", auth, async (req, res) => {
    const { duration } = req.body;
    if (typeof duration !== "number" || duration < 0) {
        return res.status(400).json({ message: "Invalid duration" });
    }

    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity)
            return res.status(404).json({ message: "Activity not found" });

        if (activity.userId.toString() !== req.user) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        activity.duration = duration;
        await activity.save();
        res.status(200).json(activity);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});




module.exports = router;
