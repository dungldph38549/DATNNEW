import React, { useState } from 'react';

const AdminPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('');

    const renderContent = () => {
        switch (selectedMenu) {
            case 'products':
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">📦 Danh sách Sản phẩm</h2>
                        <table className="min-w-full bg-white border rounded shadow">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                    <th className="px-4 py-2">STT</th>
                                    <th className="px-4 py-2">Tên sản phẩm</th>
                                    <th className="px-4 py-2">Giá</th>
                                    <th className="px-4 py-2">Tồn kho</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2">1</td>
                                    <td className="px-4 py-2">Áo Thun</td>
                                    <td className="px-4 py-2">150.000₫</td>
                                    <td className="px-4 py-2">20</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2">2</td>
                                    <td className="px-4 py-2">Quần Jean</td>
                                    <td className="px-4 py-2">300.000₫</td>
                                    <td className="px-4 py-2">15</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );

            case 'orders':
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">🧾 Danh sách Đơn hàng</h2>
                        <table className="min-w-full bg-white border rounded shadow">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                    <th className="px-4 py-2">Mã đơn</th>
                                    <th className="px-4 py-2">Khách hàng</th>
                                    <th className="px-4 py-2">Tổng tiền</th>
                                    <th className="px-4 py-2">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2">#001</td>
                                    <td className="px-4 py-2">Nguyễn Văn A</td>
                                    <td className="px-4 py-2">450.000₫</td>
                                    <td className="px-4 py-2">Đã giao</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2">#002</td>
                                    <td className="px-4 py-2">Trần Thị B</td>
                                    <td className="px-4 py-2">300.000₫</td>
                                    <td className="px-4 py-2">Chờ xử lý</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );

            case 'users':
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">👤 Danh sách Người dùng</h2>
                        <table className="min-w-full bg-white border rounded shadow">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                    <th className="px-4 py-2">STT</th>
                                    <th className="px-4 py-2">Tên</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Vai trò</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2">1</td>
                                    <td className="px-4 py-2">Admin</td>
                                    <td className="px-4 py-2">admin@example.com</td>
                                    <td className="px-4 py-2">Quản trị viên</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2">2</td>
                                    <td className="px-4 py-2">Người dùng A</td>
                                    <td className="px-4 py-2">userA@example.com</td>
                                    <td className="px-4 py-2">Khách hàng</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return <p className="text-gray-600">📋 Chọn mục bên trái để xem nội dung</p>;
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-[20rem] h-screen bg-white p-4 shadow-xl">
                <h2 className="text-2xl font-semibold mb-6">Trang Admin</h2>
                <nav className="flex flex-col gap-2">
                    <button onClick={() => setSelectedMenu('products')} className="text-left p-3 rounded hover:bg-blue-100">Quản lý sản phẩm</button>
                    <button onClick={() => setSelectedMenu('orders')} className="text-left p-3 rounded hover:bg-blue-100">Quản lý đơn hàng</button>
                    <button onClick={() => setSelectedMenu('users')} className="text-left p-3 rounded hover:bg-blue-100">Quản lý người dùng</button>
                    <button onClick={() => alert('Đã đăng xuất')} className="text-left p-3 rounded hover:bg-red-100 text-red-600">Đăng xuất</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-50 min-h-screen">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPage;
