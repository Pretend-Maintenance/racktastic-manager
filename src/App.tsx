import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import Index from "@/pages/Index"
import TransactionLogPage from "@/pages/TransactionLogPage"
import SettingsPage from "@/pages/SettingsPage"

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/logs" element={<TransactionLogPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <Toaster />
      </Router>
    </TooltipProvider>
  )
}

export default App