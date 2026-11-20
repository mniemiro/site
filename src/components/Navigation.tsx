import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Front" },
  { to: "/seminars", label: "Seminars, Travel, Etc" },
  { to: "/notes", label: "Research" },
  { to: "/miscellany", label: "Misc" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="site-nav" aria-label="Pages">
      <div className="site-nav-links">
        {links.map(({ to, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={active ? "nav-active" : "nav-idle"}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
