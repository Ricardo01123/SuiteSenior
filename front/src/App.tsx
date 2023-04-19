import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import TestPage from "./pages/Test1";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/test1" element={<TestPage />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
