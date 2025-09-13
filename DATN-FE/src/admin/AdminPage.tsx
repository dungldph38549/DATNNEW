import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Order from './Order';
import Products from './Products';
import Categories from './Categories';
import Brands from './Brands';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/user';
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
        if(!user.isAdmin && user.login) {
            navigate('/'); 
            return;
        }
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
            // case 'users':
            //     return (<Users />);
            // case 'vouchers':
            //     return (<Vouchers />);
            case 'brands':
                return (<Brands />);
            case 'categories':
                return (<Categories />);
            default:
                return <p className="text-gray-600">📋 Chọn mục bên trái để xem nội dung</p>;
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-[20rem] p-4 shadow-xl" style={{ minWidth: '200px' }}>
                <h2 className="text-2xl font-semibold mb-6">Trang Admin</h2>
                <nav className="flex flex-col gap-2">
                    <button onClick={() => handleMenuClick('products')} className={`text-left p-3 rounded ${selectedMenu === 'products' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý sản phẩm</button>
                    <button onClick={() => handleMenuClick('orders')} className={`text-left p-3 rounded ${selectedMenu === 'orders' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý đơn hàng</button>
                    <button onClick={() => handleMenuClick('users')} className={`text-left p-3 rounded ${selectedMenu === 'users' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý người dùng</button>
                    <button onClick={() => handleMenuClick('vouchers')} className={`text-left p-3 rounded ${selectedMenu === 'vouchers' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý voucher</button>
                    <button onClick={() => handleMenuClick('categories')} className={`text-left p-3 rounded ${selectedMenu === 'categories' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý danh mục</button>
                    <button onClick={() => handleMenuClick('brands')} className={`text-left p-3 rounded ${selectedMenu === 'brands' ? 'bg-blue-100': 'hover:bg-blue-100 '}`}>Quản lý thương hiệu</button>
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