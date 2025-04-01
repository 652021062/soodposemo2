const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // เช่น 10:00 AM - 11:00 AM
  clientName: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Completed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
