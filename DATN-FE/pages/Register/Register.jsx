import React from 'react'

const Register = () => {
return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
        <h2 className="text-3xl font-bold text-center mb-2">Đăng ký</h2>
        <div className="border-b mb-6"></div>
        <p className="text-gray-600 text-center mb-6">
            Xin chào, hãy tạo tài khoản mới để bắt đầu trải nghiệm.
        </p>
        <div className="flex gap-4 mb-6">
            <button className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded transition">
                Đăng ký bằng Facebook
            </button>
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded transition">
                Đăng ký bằng Twitter
            </button>
        </div>
        <form className="space-y-4">
            <div>
                <label className="block font-semibold mb-1" htmlFor="name">
                    Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập họ và tên"
                    required
                />
            </div>
            <div>
                <label className="block font-semibold mb-1" htmlFor="email">
                    Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập email"
                    required
                />
            </div>
            <div>
                <label className="block font-semibold mb-1" htmlFor="password">
                    Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                    id="password"
                    type="password"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập mật khẩu"
                    required
                />
            </div>
            <div>
                <label className="block font-semibold mb-1" htmlFor="confirmPassword">
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập lại mật khẩu"
                    required
                />
            </div>
            <div className="flex items-center justify-between mt-2">
                <span className="text-sm">
                    Đã có tài khoản?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </a>
                </span>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded mt-4 transition"
            >
                ĐĂNG KÝ
            </button>
        </form>
    </div>
)
}

export default Register