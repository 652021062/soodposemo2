const express = require('express');
const Schedule = require('../models/Schedule');
const router = express.Router();

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a new schedule (จองคิว)
router.post('/', async (req, res) => {
  const { date, timeSlot, clientName } = req.body;
  const newSchedule = new Schedule({ date, timeSlot, clientName });
  try {
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
