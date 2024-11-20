import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-primary">
            Racks
          </Link>
          <Link to="/network-map" className="transition-colors hover:text-primary">
            Network Map
          </Link>
          <Link to="/transactions" className="transition-colors hover:text-primary">
            Transaction Log
          </Link>
          <Link to="/settings" className="transition-colors hover:text-primary">
            Settings
          </Link>
        </nav>
      </div>
    </div>
  );
}