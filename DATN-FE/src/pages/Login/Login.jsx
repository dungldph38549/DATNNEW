import React from "react";
import { loginUser } from "../../api";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../../redux/user";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      await Swal.fire({
        title: "Đăng nhập thành công!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      dispatch(
        updateUserInfo({
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          isAdmin: data.data.isAdmin,
          isGuest: false,
          token: data.acess_token,
          refreshToken: data.refresh_token,
          address: data.data.address,
          login: true,
          avatar: data.data.avatar,
        })
      );
      if (data.data.isAdmin) navigate("/admin");
      else navigate("/");
    },
    onError: (error) => {
      Swal.fire({
        title: "Thất bại!",
        text:
          error?.response?.data.message || "Có lỗi xảy ra, vui lòng thử lại.",
        icon: "error",
      });
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPending) return;
    mutate(formData);
  };
  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-8 rounded shadow ">
      <h2 className="text-2xl font-semibold mb-2 ml-[200px]  ">Đăng nhập</h2>
      <hr className="mb-4" />
      <p className="mb-6 text-gray-700">
        Xin chào, chào mừng bạn đến với tài khoản của bạn.
      </p>
      {/* <div className="flex gap-4 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#3b5998] hover:bg-[#334f88] text-white font-semibold py-3 rounded transition">
                <i className="fab fa-facebook-f"></i>
                Đăng nhập bằng Facebook
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1da1f2] hover:bg-[#1991c2] text-white font-semibold py-3 rounded transition">
                <i className="fab fa-twitter"></i>
                Đăng nhập bằng Twitter
            </button>
        </div> */}
      <form>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">
            Địa chỉ Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2">
            <span className="text-sm">
              Chưa có tài khoản?{" "}
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
            onClick={handleSubmit}
            disabled={isPending}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded transition"
          >
            ĐĂNG NHẬP
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
