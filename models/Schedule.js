const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // เช่น 10:00 AM - 11:00 AM
  clientName: { type: String, required: true, trim: true },
  phoneNumber: { 
    type: String, 
    required: true, 
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{9,10}$/.test(v); // ตรวจสอบว่าเป็นตัวเลข 9-10 หลัก
      },
      message: props => `${props.value} ไม่ใช่หมายเลขโทรศัพท์ที่ถูกต้อง`
    }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed'], 
    default: 'Pending' 
  },
  jobDetails: { type: String, required: false, trim: true }, // เพิ่มฟิลด์รายละเอียดของงาน
  createdAt: { type: Date, default: Date.now }
});

// ป้องกันการจองซ้ำ
scheduleSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

// แปลง `date` เป็นรูปแบบที่อ่านง่ายเมื่อส่ง JSON กลับไป
scheduleSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.date = ret.date.toISOString().split('T')[0]; // แปลงเป็น YYYY-MM-DD
    return ret;
  }
});

// ตรวจสอบว่าโมเดล `Schedule` มีอยู่ใน `mongoose.models` หรือไม่
const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
