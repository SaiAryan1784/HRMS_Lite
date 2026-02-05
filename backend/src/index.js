const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const employeeRoutes = require('./routes/employee.routes');
const attendanceRoutes = require('./routes/attendance.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
    res.send('HRMS Lite API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
