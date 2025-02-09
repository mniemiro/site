import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <header className="w-full border-b-[1px] bg-background font-['Anonymous_Pro']">
      <div className="container max-w-3xl h-24 pt-12 pb-2 flex items-start justify-between px-4">
        <Link 
          to="/" 
          className="text-3xl font-['Anonymous_Pro'] font-thin text-foreground hover:text-orange-500 transition-colors"
        >
          M.A. Niemiro
        </Link>
        <nav className="flex items-start gap-2 font-['Roboto_Mono'] text-base pt-2">
          <Link
            to="/about"
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
