import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="container flex items-center justify-between h-16 max-w-3xl">
        <div>
          <Link to="/" className="text-sm hover:text-gray-700 dark:hover:text-gray-300">
            M.A. Niemiro
          </Link>
        </div>
        
        <nav className="flex items-center space-x-1 text-sm">
          <Link
            to="/"
            className={`px-2 py-1 rounded-md ${
              isActive("/")
                ? "font-bold"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <Link
            to="/notes"
            className={`px-2 py-1 rounded-md ${
              isActive("/notes")
                ? "font-bold"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Notes
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <Link
            to="/infinity"
            className={`px-2 py-1 rounded-md ${
              isActive("/infinity")
                ? "font-bold"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            ∞
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <Link
            to="/miscellany"
            className={`px-2 py-1 rounded-md ${
              isActive("/miscellany")
                ? "font-bold"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Miscellany
          </Link>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
