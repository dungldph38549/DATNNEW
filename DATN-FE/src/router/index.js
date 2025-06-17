import Category from "../pages/Category/Category.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import Detail from "../pages/Detail/Detail.jsx";
import FooterPage from "../pages/FooterPage/FooterPage.tsx";
import HomePages from "../pages/HomePages/HomePages.tsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";

export const routers = [
    {
        path: "/",
        page: HomePages,
    },
    {
        path: "/category",
        page: Category,
    },
    {
        path: "/detail",
        page: Detail,
    },
    {
        path: "/checkout",
        page: Checkout,
    },
    {
        path: "/login",
        page: Login,
    },
    {
        path: "/register",
        page: Register,
    },
    {
        path: "footer",
        page: FooterPage,
    }
]