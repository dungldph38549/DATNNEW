import FooterPage from "../pages/FooterPage/FooterPage.tsx";
import HomePages from "../pages/HomePages/HomePages.tsx";

export const routers = [
    {
        path: "/",
        page: HomePages,
    },
    {
        path: "footer",
        page: FooterPage,
    }
]