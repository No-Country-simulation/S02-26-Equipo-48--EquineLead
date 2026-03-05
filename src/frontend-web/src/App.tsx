import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import ClientLandingPage from "./pages/LandingPage/ClientLandingPage";
import AppDownload from "./pages/AppDownload/AppDownload";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route — client landing (no sidebar) */}
        <Route
          path="/landing"
          element={
            <PublicLayout>
              <ClientLandingPage />
            </PublicLayout>
          }
        />

        {/* Admin routes — with sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/download" element={<AppDownload />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;