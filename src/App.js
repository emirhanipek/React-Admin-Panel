import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Category from "./pages/Categories";
import Slider from "./pages/Slider";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Brands from "./pages/Brands";
import Signboards from "./pages/Signboards";
import LightTypes from "./pages/LightTypes";
import FrontMaterials from "./pages/FrontMaterials";
import LetterHeights from "./pages/LetterHeights";
import BackgroundColors from "./pages/BackgroundColors";
function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/category" element={<Category />} />
              <Route path="/slider" element={<Slider />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/signboards" element={<Signboards />} />
              <Route path="/light-types" element={<LightTypes />} />
              <Route path="/front-materials" element={<FrontMaterials />} />
              <Route path="/letter-heights" element={<LetterHeights />} />
              <Route path="/background-colors" element={<BackgroundColors />} />
            </Routes>
          </main>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
