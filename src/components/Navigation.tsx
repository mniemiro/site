import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const location = useLocation();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="container max-w-3xl px-4 h-16 flex items-center justify-between">
      <Link 
          to="/" 
          className="text-2xl sm:text-3xl font-inconsolata font-thin text-foreground hover:text-orange-500 transition-colors"
        >
          M.A. Niemiro
        </Link>
        
        <nav className="flex items-center space-x-1 text-sm pb-1">
          <Link
            to="/"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors ${
              location.pathname === "/" ? "font-bold" : ""
            }`}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/notes"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors ${
              location.pathname === "/notes" ? "font-bold" : ""
            }`}
          >
            Notes
          </Link>
          <span>/</span>
          <Link
            to="/infinity"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors ${
              location.pathname === "/infinity" ? "font-bold" : ""
            }`}
          >
            ∞
          </Link>
          <span>/</span>
          <Link
            to="/miscellany"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors ${
              location.pathname === "/miscellany" ? "font-bold" : ""
            }`}
          >
            Miscellany
          </Link>
          <span>/</span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};
