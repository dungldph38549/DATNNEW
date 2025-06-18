import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routers } from './router/index.js';
import Hearder from './components/Headers/Hearder.tsx';
import FooterComponent from './components/FooterComponent/FooterComponent.jsx';

function App() {
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
