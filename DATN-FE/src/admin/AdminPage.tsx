import React from 'react';

const AdminPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">👩‍💼 Trang quản trị</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Sản phẩm</h2>
                        <p className="text-gray-600 mb-4">Quản lý danh sách sản phẩm trong cửa hàng.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Xem chi tiết</button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Người dùng</h2>
                        <p className="text-gray-600 mb-4">Quản lý tài khoản người dùng.</p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Xem chi tiết</button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Đơn hàng</h2>
                        <p className="text-gray-600 mb-4">Theo dõi và xử lý đơn hàng.</p>
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Xem chi tiết</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;