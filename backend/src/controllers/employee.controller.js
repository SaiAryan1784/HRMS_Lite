const prisma = require('../prisma');
const { z } = require('zod');

const employeeSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    department: z.string().min(1, 'Department is required'),
});

exports.createEmployee = async (req, res) => {
    try {
        const data = employeeSchema.parse(req.body);

        const existing = await prisma.employee.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            return res.status(409).json({ error: 'Employee with this email already exists' });
        }

        const employee = await prisma.employee.create({ data });
        res.status(201).json(employee);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.findUnique({ where: { id } });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        await prisma.employee.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
