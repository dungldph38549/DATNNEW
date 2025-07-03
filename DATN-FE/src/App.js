import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { routers } from './router/index.js';
import Hearder from './components/Headers/Hearder.tsx';
import FooterComponent from './components/FooterComponent/FooterComponent.jsx';
import { useMemo } from 'react';

function AppContent() {
  const location = useLocation();

  // Tìm route hiện tại
  const currentRoute = useMemo(() => {
    return routers.find((route) => route.path === location.pathname);
  }, [location.pathname]);

  const showHeaderFooter = currentRoute?.isShowHeader !== false;

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && <Hearder />}

      <main className="flex-grow">
        <Routes>
          {routers.map((route, index) => {
            const Page = route.page;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Routes>
      </main>

      {showHeaderFooter && <FooterComponent />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
