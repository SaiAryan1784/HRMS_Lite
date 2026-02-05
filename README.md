# HRMS Lite

A lightweight Human Resource Management System (HRMS) built with Node.js, Express, Prisma, PostgreSQL, React, and TailwindCSS.

## Features
- **Employee Management**: Add, View, Delete employees.
- **Attendance Management**: Mark attendance (Present/Absent), View attendance records by date.

## Tech Stack
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL (Neon DB).
- **Frontend**: React (Vite), TailwindCSS, React Router, Axios.

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database (e.g., Neon, Railway, Local)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HRMS_Lite
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in `backend/` and add your database URL:
  ```
  DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
  ```
- Run Database Migrations:
  ```bash
  npm run migrate
  ```
- Start the Server:
  ```bash
  npm start
  ```
  The Backend will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The Frontend will run on `http://localhost:5173`.

## Deployment

### Backend (Render/Railway)
1. Build Command: `npm install`
2. Start Command: `npm start`
3. Environment Variable: Set `DATABASE_URL` in the hosting platform.

### Frontend (Vercel/Netlify)
1. Build Command: `npm run build`
2. Output Directory: `dist`
3. Environment Variable: If needed, set `VITE_API_URL` to your deployed backend URL (You might need to update `frontend/src/pages/EmployeeList.jsx` and `AttendanceView.jsx` to use `import.meta.env.VITE_API_URL` instead of hardcoded localhost).

## API Endpoints
- `GET /api/employees`: List all employees
- `POST /api/employees`: Create new employee
- `DELETE /api/employees/:id`: Delete employee
- `GET /api/attendance`: Get attendance (query param `?date=YYYY-MM-DD`)
- `POST /api/attendance`: Mark attendance

