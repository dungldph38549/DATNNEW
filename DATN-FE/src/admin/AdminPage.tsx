import React, { useState } from 'react';

const AdminPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('');

    const renderContent = () => {
        switch (selectedMenu) {
            case 'products':
                return <div>🛒 Đây là trang Quản lý Sản phẩm</div>;
            case 'orders':
                return <div>📦 Đây là trang Quản lý Đơn hàng</div>;
            case 'users':
                return <div>👤 Đây là trang Quản lý Người dùng</div>;
            default:
                return <div>📋 Chọn mục bên trái để xem nội dung</div>;
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 h-screen w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
                <div className="mb-4 p-4">
                    <h5 className="text-xl font-semibold">Trang Quản Trị</h5>
                </div>
                <nav className="flex flex-col gap-2">
                    <button onClick={() => setSelectedMenu('products')} className="text-left p-3 rounded hover:bg-blue-100">Quản lý sản phẩm</button>
                    <button onClick={() => setSelectedMenu('orders')} className="text-left p-3 rounded hover:bg-blue-100">Quản lý đơn hàng</button>
                    <button onClick={() => setSelectedMenu('users')} className="text-left p-3 rounded hover:bg-blue-100">Quản lý người dùng</button>
                    <button onClick={() => alert('Đã đăng xuất')} className="text-left p-3 rounded hover:bg-red-100 text-red-600">Đăng xuất</button>
                </nav>
            </div>

            {/* Nội dung bên phải */}
            <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPage;
