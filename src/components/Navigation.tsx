import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const location = useLocation();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-900">
      <div className="container max-w-3xl px-6 h-24 flex items-center justify-between">
      <Link 
          to="/" 
          className="text-2xl sm:text-3xl font-inconsolata font-thin text-foreground hover:text-orange-500 transition-colors"
        >
          M.A. Niemiro
        </Link>
        
        <nav className="flex items-end space-x-2 text-sm pb-1">
          <Link
            to="/"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors px-1.5 py-1 ${
              location.pathname === "/" ? "font-bold" : ""
            }`}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/notes"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors px-2 py-1 ${
              location.pathname === "/notes" ? "font-bold" : ""
            }`}
          >
            Notes
          </Link>
          <span>/</span>
          <Link
            to="/infinity"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors px-2 py-1 ${
              location.pathname === "/infinity" ? "font-bold" : ""
            }`}
          >
            ∞
          </Link>
          <span>/</span>
          <Link
            to="/miscellany"
            className={`text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors px-2 py-1 ${
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
