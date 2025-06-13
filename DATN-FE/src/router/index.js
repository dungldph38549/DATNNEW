import Category from "../pages/Category/Category.jsx";
import FooterPage from "../pages/FooterPage/FooterPage.tsx";
import HomePages from "../pages/HomePages/HomePages.tsx";

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
        path: "footer",
        page: FooterPage,
    }
]