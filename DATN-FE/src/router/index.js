import Category from "../pages/Category/Category.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import Detail from "../pages/Detail/Detail.jsx";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx";
import HomePages from "../pages/HomePages/HomePages.tsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import CartPage from "../pages/CartPage/CartPage.tsx";

export const routers = [
  {
    path: "/",
    page: HomePages,
    isShowHeader: true,
  },
  {
    path: "/category",
    page: Category,
    isShowHeader: true,
  },
  {
    path: "/detail",
    page: Detail,
    isShowHeader: true,
  },
  {
    path: "/checkout",
    page: Checkout,
    isShowHeader: true,
  },
  {
    path: "/login",
    page: Login,
    isShowHeader: true,
  },
  {
    path: "/register",
    page: Register,
    isShowHeader: true,
  },
  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
