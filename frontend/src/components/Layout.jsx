import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Users, Calendar, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { path: '/employees', label: 'Employees', icon: Users },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {}
            <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold text-gray-900">HRMS Lite</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {}
                <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-500 rounded-md hover:text-gray-900 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900">HRMS Lite</span>
                    <div className="w-6" /> {}
                </div>

                {}
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
