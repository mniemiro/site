import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const location = useLocation();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-900">
      <div className="container max-w-3xl px-6 h-24 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl sm:text-3xl font-inconsolata font-normal text-foreground hover:text-link transition-colors tracking-tight"
        >
          M.A. Niemiro
        </Link>
        
        <nav className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-1 sm:space-x-2 text-sm">
          <Link
            to="/"
            className={`text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors px-0.5 sm:px-1.5 py-1.5 mt-2 font-light ${
              location.pathname === "/" ? "font-normal" : ""
            }`}
          >
            Home
          </Link>
          <span className="hidden sm:block mt-2">/</span>
          <Link
            to="/seminars"
            className={`text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors px-0.5 sm:px-1.5 py-1.5 mt-2 font-light ${
              location.pathname === "/seminars" ? "font-normal" : ""
            }`}
          >
            Seminars
          </Link>
          <span className="hidden sm:block mt-2">/</span>
          <Link
            to="/notes"
            className={`text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors px-0.5 sm:px-1.5 py-1.5 mt-2 font-light ${
              location.pathname === "/notes" ? "font-normal" : ""
            }`}
          >
            Notes
          </Link>
          <span className="hidden sm:block mt-2">/</span>
          <Link
            to="/infinity"
            className={`text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors px-0.5 sm:px-1.5 py-1.5 mt-2 font-light ${
              location.pathname === "/infinity" ? "font-normal" : ""
            }`}
          >
            ∞
          </Link>
          <span className="hidden sm:block mt-2">/</span>
          <Link
            to="/miscellany"
            className={`text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors px-0.5 sm:px-1.5 py-1.5 mt-2 font-light ${
              location.pathname === "/miscellany" ? "font-normal" : ""
            }`}
          >
            Miscellany
          </Link>
          <span className="hidden sm:block mt-2">/</span>
          <div className="mt-3 sm:mt-3">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};
