const express = require('express');
const Schedule = require('../models/Schedule');
const router = express.Router();

// 📌 ดึงข้อมูลทั้งหมด (Sorted)
router.get('/', async (req, res) => {
  try {
      const schedules = await Schedule.find().sort({ date: 1, timeSlot: 1 });

      // ✅ แปลง `date` เป็น `YYYY-MM-DD` ก่อนส่งไปยัง frontend
      const formattedSchedules = schedules.map(s => ({
          clientName: s.clientName,
          phoneNumber: s.phoneNumber, // ✅ ส่งหมายเลขโทรศัพท์
          date: s.date.toISOString().split('T')[0], // แปลงเป็น YYYY-MM-DD
          timeSlot: s.timeSlot,
          jobDetails: s.jobDetails // ✅ ส่งรายละเอียดของงาน
      }));

      res.json(formattedSchedules);

  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

// 📌 จองคิว (เพิ่มข้อมูล)
router.post('/', async (req, res) => {
  let { date, timeSlot, clientName, phoneNumber, jobDetails } = req.body;

  // ✅ ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!date || !timeSlot || !clientName || !phoneNumber || !jobDetails) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  // ✅ ตรวจสอบหมายเลขโทรศัพท์ (ต้องเป็นตัวเลข 9-10 หลัก)
  if (!/^[0-9]{9,10}$/.test(phoneNumber)) {
      return res.status(400).json({ error: "❌ หมายเลขโทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)" });
  }

  try {
      // ✅ แปลง `date` ให้เป็นรูปแบบ `YYYY-MM-DDT00:00:00.000Z`
      const formattedDate = new Date(date);
      formattedDate.setUTCHours(0, 0, 0, 0); // ทำให้เป็นเวลา 00:00:00 UTC

      // ✅ ตรวจสอบว่าช่วงเวลานี้ถูกจองไปแล้วหรือยัง
      const existingSchedule = await Schedule.findOne({ 
          date: formattedDate, 
          timeSlot 
      });

      if (existingSchedule) {
          return res.status(400).json({ error: "❌ ช่วงเวลานี้ถูกจองไปแล้ว" });
      }

      // ✅ บันทึกข้อมูลลง MongoDB
      const newSchedule = new Schedule({ 
          date: formattedDate, 
          timeSlot, 
          clientName, 
          phoneNumber, // ✅ เพิ่มหมายเลขโทรศัพท์
          jobDetails   // ✅ เพิ่มรายละเอียดของงาน
      });
      await newSchedule.save();

      res.status(201).json({ message: "✅ จองคิวสำเร็จ!", data: newSchedule });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;
