const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ตรวจสอบค่าตัวแปรจาก .env
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

// เชื่อมต่อ MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Schedule model
const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  clientName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true }, // ✅ เพิ่มเบอร์โทรศัพท์
  jobDetails: { type: String, required: true }, // รายละเอียดงาน
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

// ป้องกันการจองซ้ำ
scheduleSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

// แปลง `date` เป็นรูปแบบที่อ่านง่าย
scheduleSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.date = ret.date.toISOString().split('T')[0]; // แปลงเป็น YYYY-MM-DD
    return ret;
  }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

// Routes
const galleryRoutes = require('./routes/gallery');
const scheduleRoutes = require('./routes/schedule');

// ใช้ routes สำหรับการเข้าถึงข้อมูล
app.use('/api/gallery', galleryRoutes);
app.use('/api/schedule', scheduleRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
