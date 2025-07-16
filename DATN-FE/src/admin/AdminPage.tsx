<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Order from './Order';
import Products from './Products';
import Users from './Users';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/user';
=======
import React, { useState } from 'react';
import Order from './Order';
import Products from './Products';
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5

const AdminPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const [selectedMenu, setSelectedMenu] = useState('products');

    const handleMenuClick = (menu: string) => {
        if(user.isAdmin && user.login) {
            setSelectedMenu(menu);
        }
    }

    useEffect(() => {
        if (!user.isAdmin || !user.login) {
            navigate('/login'); 
        }
    }, [user.isAdmin, user.login]);

    const renderContent = () => {
        switch (selectedMenu) {
            case 'products':
                return (<Products />);

            case 'orders':
                return ( <Order />);

            case 'users':
                return (<Users />);
            default:
                return <p className="text-gray-600">📋 Chọn mục bên trái để xem nội dung</p>;
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-[20rem] h-screen bg-white p-4 shadow-xl" style={{ minWidth: '150px' }}>
                <h2 className="text-2xl font-semibold mb-6">Trang Admin</h2>
                <nav className="flex flex-col gap-2">
                    <button onClick={() => handleMenuClick('products')} className={`text-left p-3 rounded ${selectedMenu === 'products' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý sản phẩm</button>
                    <button onClick={() => handleMenuClick('orders')} className={`text-left p-3 rounded ${selectedMenu === 'orders' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý đơn hàng</button>
                    <button onClick={() => handleMenuClick('users')} className={`text-left p-3 rounded ${selectedMenu === 'users' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý người dùng</button>
                    <button onClick={() => {
                        dispatch(clearUser());
                        navigate('/login');
                    }} className={`text-left p-3 rounded hover:bg-red-100 text-red-600`}>
                        Đăng xuất
                    </button>
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
