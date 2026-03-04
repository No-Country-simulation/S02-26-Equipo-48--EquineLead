import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import AppDownload from "./pages/AppDownload/AppDownload";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/download" element={<AppDownload />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;