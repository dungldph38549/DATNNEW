import React from 'react'

const Login = () => {
return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-8 rounded shadow ">
        <h2 className="text-2xl font-semibold mb-2 ml-[200px]  ">Đăng nhập</h2>
        <hr className="mb-4" />
        <p className="mb-6 text-gray-700">
            Xin chào, chào mừng bạn đến với tài khoản của bạn.
        </p>
        <div className="flex gap-4 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#3b5998] hover:bg-[#334f88] text-white font-semibold py-3 rounded transition">
                <i className="fab fa-facebook-f"></i>
                Đăng nhập bằng Facebook
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1da1f2] hover:bg-[#1991c2] text-white font-semibold py-3 rounded transition">
                <i className="fab fa-twitter"></i>
                Đăng nhập bằng Twitter
            </button>
        </div>
        <form>
            <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="email">
                    Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="password">
                    Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                    id="password"
                    type="password"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>
            <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2">
                     <span className="text-sm">
                    Chưa có tài khoản?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Đăng ký
                    </a>
                </span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                    Quên mật khẩu?
                </a>
            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded transition"
                >
                    ĐĂNG NHẬP
                </button>
            </div>
        </form>
    </div>
)
}

export default Login