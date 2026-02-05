const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.post('/', attendanceController.markAttendance);
router.get('/', attendanceController.getAttendance);
router.put('/:id', attendanceController.updateAttendance);

module.exports = router;
