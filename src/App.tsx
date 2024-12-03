import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NetworkMapPage from "./pages/NetworkMapPage";
import SettingsPage from "./pages/SettingsPage";
import AuditReportPage from "./pages/AuditReportPage";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/network-map" element={<NetworkMapPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/audit" element={<AuditReportPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;