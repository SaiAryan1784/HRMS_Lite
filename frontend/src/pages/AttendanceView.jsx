import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Calendar as CalendarIcon, Filter, Plus, Edit } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AttendanceView = () => {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(5);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [markData, setMarkData] = useState({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'PRESENT'
    });
    const [submitMessage, setSubmitMessage] = useState(null);

    const [expandedRowId, setExpandedRowId] = useState(null);
    const [editStatus, setEditStatus] = useState('PRESENT');
    const [editMessage, setEditMessage] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [filterDate, page]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${API_URL}/employees`);
            setEmployees(response.data);
        } catch (err) {
            console.error("Failed to fetch employees", err);
        }
    };

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/attendance`, {
                params: {
                    date: filterDate,
                    page,
                    limit
                }
            });
            if (response.data.meta) {
                setAttendance(response.data.data);
                setTotalPages(response.data.meta.totalPages);
            } else {
                setAttendance(response.data);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch attendance records.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage(null);

        if (!markData.employeeId) {
            setSubmitMessage({ type: 'error', text: 'Please select an employee' });
            return;
        }

        try {
            await axios.post(`${API_URL}/attendance`, markData);
            setSubmitMessage({ type: 'success', text: 'Attendance marked successfully' });
            fetchAttendance();
            setMarkData({ ...markData, employeeId: '', status: 'PRESENT' });
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to process attendance';
            setSubmitMessage({ type: 'error', text: Array.isArray(msg) ? msg[0].message : msg });
        }
    };

    const toggleRow = (record) => {
        if (expandedRowId === record.id) {
            setExpandedRowId(null);
            setEditMessage(null);
        } else {
            setExpandedRowId(record.id);
            setEditStatus(record.status);
            setEditMessage(null);
        }
    };

    const handleInlineUpdate = async (id) => {
        setEditMessage(null);
        try {
            await axios.put(`${API_URL}/attendance/${id}`, { status: editStatus });
            setEditMessage({ type: 'success', text: 'Updated successfully' });
            fetchAttendance();
        } catch (err) {
            const msg = err.response?.data?.error || 'Update failed';
            setEditMessage({ type: 'error', text: msg });
        }
    };

    const getStatusBadge = (status) => {
        return status === 'PRESENT'
            ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Present</span>
            : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Absent</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none"
                >
                    {isFormOpen ? 'Close Mark Attendance' : 'Mark New Attendance'}
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 fade-in">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Mark New Attendance</h2>
                    {submitMessage && (
                        <div className={`mb-4 p-3 rounded text-sm ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {submitMessage.text}
                        </div>
                    )}
                    <form onSubmit={handleMarkSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border p-2"
                                value={markData.date}
                                onChange={(e) => setMarkData({ ...markData, date: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                            <select
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border p-2"
                                value={markData.employeeId}
                                onChange={(e) => setMarkData({ ...markData, employeeId: e.target.value })}
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.department})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border p-2"
                                value={markData.status}
                                onChange={(e) => setMarkData({ ...markData, status: e.target.value })}
                            >
                                <option value="PRESENT">Present</option>
                                <option value="ABSENT">Absent</option>
                            </select>
                        </div>
                        <div className="md:col-start-4">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter View:</span>
                <input
                    type="date"
                    className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border p-1"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Attendance Records for {new Date(filterDate).toDateString()}
                    </h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading attendance...</div>
                ) : attendance.length > 0 ? (
                    <>
                        <ul className="divide-y divide-gray-200">
                            {attendance.map((record) => (
                                <li key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between cursor-pointer" onClick={() => toggleRow(record)}>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                {record.employee.fullName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{record.employee.fullName}</div>
                                                <div className="text-sm text-gray-500">{record.employee.department}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(record.status)}
                                            <button
                                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleRow(record);
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {expandedRowId === record.id && (
                                        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-100 fade-in">
                                            <div className="flex flex-col sm:flex-row items-end gap-4">
                                                <div className="w-full sm:w-auto flex-grow">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                                                    <select
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border p-2"
                                                        value={editStatus}
                                                        onChange={(e) => setEditStatus(e.target.value)}
                                                    >
                                                        <option value="PRESENT">Present</option>
                                                        <option value="ABSENT">Absent</option>
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => handleInlineUpdate(record.id)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => toggleRow(record)}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            {editMessage && (
                                                <div className={`mt-3 text-sm ${editMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {editMessage.text}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                                            disabled={page === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No attendance records found for this date.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceView;