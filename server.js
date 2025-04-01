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
  process.exit(1); // หยุดโปรแกรมถ้าไม่มีการตั้งค่าตัวแปร MONGODB_URI
}

// เชื่อมต่อ MongoDB (ไม่มี useNewUrlParser และ useUnifiedTopology)
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const galleryRoutes = require('./routes/gallery');
const scheduleRoutes = require('./routes/schedule');

// ใช้ routes สำหรับการเข้าถึงข้อมูล
app.use('/api/gallery', galleryRoutes);
app.use('/api/schedule', scheduleRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
