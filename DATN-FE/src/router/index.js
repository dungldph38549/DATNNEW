import Category from "../pages/Category/Category.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import Detail from "../pages/Detail/Detail.jsx";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx";
import HomePages from "../pages/HomePages/HomePages.tsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import CartPage from "../pages/CartPage/CartPage.tsx";
import AdminPage from "../admin/AdminPage.tsx";
import CheckoutPage from "../pages/CheckoutPage/checkOutPage.tsx";
import OrderPage from "../pages/OrderPage/OrderPage.jsx";
import OrderDetailPage from "../pages/OrderDetailPage/OrderDetailPage.jsx";
import AdminOrderDetailPage from "../admin/AdminOrderDetail.jsx";

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
        path: "/detail/:id",
        page: Detail,
        isShowHeader: true,
    },
    {
        path: "/checkout",
        page: Checkout,
        isShowHeader: true,
    },
    {
        path: "/cart",
        page: CartPage,
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
        path: "*",
        page: NotFoundPage,
        isShowHeader: false,
    },
    {
        path: "/admin",
        page: AdminPage,
        isShowHeader: false,
    },
    {
        path: "/checkoutpage",
        page: CheckoutPage,
        isShowHeader: true,
    },
    {
        path: "/orders",
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: "/order/:id",
        page: OrderDetailPage,
        isShowHeader: true,
    },
    {
        path: "/admin/order/:id",
        page: AdminOrderDetailPage,
        isShowHeader: false,
    },
]