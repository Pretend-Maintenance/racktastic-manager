import { Link } from "react-router-dom";
import { FileSpreadsheet, Settings2, Network, Home } from "lucide-react";

export function MainNav() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/network-map"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Network className="h-4 w-4" />
            <span>Network Map</span>
          </Link>
          <Link
            to="/audit"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Audit & Docs</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Settings2 className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}