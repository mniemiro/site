import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <header className="w-full border-b-[1px] bg-background">
      <div className="container max-w-3xl h-24 pt-12 pb-4 flex items-start justify-between px-4">
        <Link 
          to="/" 
          className="text-3xl font-inconsolata font-thin text-foreground hover:text-orange-500 transition-colors"
        >
          M.A. Niemiro
        </Link>
        <nav className="flex items-start gap-2 text-base pt-2">
          <Link
            to="/"
            className="text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            About
          </Link>
          <span className="text-foreground">/</span>
          <Link
            to="/infinity"
            className="text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            ∞
          </Link>
          <span className="text-foreground">/</span>
          <Link
            to="/notes"
            className="text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            Notes
          </Link>
          <span className="text-foreground">/</span>
          <Link
            to="/miscellany"
            className="text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            Miscellany
          </Link>
        </nav>
      </div>
    </header>
  );
};
