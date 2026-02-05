const prisma = require('../prisma');
const { z } = require('zod');

const attendanceSchema = z.object({
    employeeId: z.string().uuid('Invalid Employee ID'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    status: z.enum(['PRESENT', 'ABSENT']),
});

exports.markAttendance = async (req, res) => {
    try {
        const data = attendanceSchema.parse(req.body);
        const date = new Date(data.date);

        date.setUTCHours(0, 0, 0, 0);

        const employee = await prisma.employee.findUnique({
            where: { id: data.employeeId },
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const existing = await prisma.attendance.findFirst({
            where: {
                employeeId: data.employeeId,
                date: date
            }
        });

        if (existing) {
            return res.status(409).json({ error: 'Attendance already marked for this date' });
        }

        const attendance = await prisma.attendance.create({
            data: {
                employeeId: data.employeeId,
                date: date,
                status: data.status,
            },
        });

        res.status(201).json(attendance);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { employeeId, date, page = 1, limit = 10 } = req.query;
        const where = {};

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        if (employeeId) where.employeeId = employeeId;
        if (date) {
            const queryDate = new Date(date);
            if (!isNaN(queryDate.getTime())) {
                queryDate.setUTCHours(0, 0, 0, 0);
                where.date = queryDate;
            }
        }

        const [total, attendance] = await Promise.all([
            prisma.attendance.count({ where }),
            prisma.attendance.findMany({
                where,
                include: {
                    employee: {
                        select: { fullName: true, department: true }
                    }
                },
                orderBy: { date: 'desc' },
                skip,
                take: limitNum,
            })
        ]);

        res.json({
            data: attendance,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PRESENT', 'ABSENT'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedAttendance = await prisma.attendance.update({
            where: { id },
            data: { status },
        });

        res.json(updatedAttendance);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Attendance record not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};