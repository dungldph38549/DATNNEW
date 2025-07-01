import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routers } from "./router/index.js";
import Hearder from "./components/Headers/Hearder.tsx";
import FooterComponent from "./components/FooterComponent/FooterComponent.jsx";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

function App() {
  // Gọi API khi component mount
  // useEffect(() => {
  //   fetchApi();
  // }, []);

  // HÀM GỌI API
  const fetchApi = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll`
    );
    return res.data;
  };
  const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  console.log("query", query);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Hearder />
        <main className="flex-grow">
          <Routes>
            {routers.map((route, index) => {
              const Page = route.page;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route.isShowHeader === false ? (
                      <Page />
                    ) : (
                      <>
                        <Page />
                      </>
                    )
                  }
                />
              );
            })}
          </Routes>
        </main>
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;
