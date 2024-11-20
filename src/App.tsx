import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import SettingsPage from "./pages/SettingsPage";
import TransactionLogPage from "./pages/TransactionLogPage";
import NetworkMapPage from "./pages/NetworkMapPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/transactions" element={<TransactionLogPage />} />
        <Route path="/network-map" element={<NetworkMapPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;