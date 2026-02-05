import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './pages/EmployeeList';
import AttendanceView from './pages/AttendanceView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="attendance" element={<AttendanceView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
