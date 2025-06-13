import CartPage from "../pages/CartPage/CartPage.tsx";
import FooterPage from "../pages/FooterPage/FooterPage.tsx";
import HomePages from "../pages/HomePages/HomePages.tsx";

export const routers = [
    {
        path: "/",
        page: HomePages,
    },
     {
        path: "/cart",
        page: CartPage,
    },
    {
        path: "footer",
        page: FooterPage,
    }
]