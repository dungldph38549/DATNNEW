import{ Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { routers } from './router/index.js'
import Hearder from './components/Headers/Hearder.tsx';
import FooterComponent from './components/FooterComponent/FooterComponent.jsx';


function App() {


  return (
    <div>
      <Hearder />
        <Router>
          <Routes>
            {routers.map((route) => {
              const Page = route.page;
              return (
              <Route path={route.path} element={<Page/>}/>
              )
            })}
          </Routes>
        </Router>
        <FooterComponent/>
    </div>
  );
}

export default App;
