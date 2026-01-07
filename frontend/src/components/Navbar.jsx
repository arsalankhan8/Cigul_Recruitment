import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/cigul-logo.png";

export default function Navbar({ onLogout }) {
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem("token");

  const isLoginActive = location.pathname === "/login";
  const isRolesActive =
    location.pathname === "/" || location.pathname === "/roles";

  const baseLink =
    "text-[11px] font-semibold tracking-[0.18em] uppercase transition";

  const inactive = `${baseLink} text-black/40 hover:text-black`;
  const active =
    "px-4 py-2 rounded-full bg-black text-white text-[11px] font-semibold tracking-[0.18em] uppercase";

  return (
    <header className="w-full bg-white border-b border-black/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <NavLink to="/" className="flex items-center">
              <img src={logo} alt="Cigul Logo" className="h-10" />
            </NavLink>

            <nav className="hidden md:flex items-center gap-6">
              {/* ALWAYS VISIBLE */}
              <NavLink
                to="/roles"
                className={isRolesActive ? active : inactive}
              >
                Open Roles
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? active : inactive)}
              >
                About Cigul
              </NavLink>

              {/* ONLY WHEN LOGGED IN */}
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/dashboard/pipeline"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    Pipeline
                  </NavLink>

                  <NavLink
                    to="/dashboard/jobs"
                    className={({ isActive }) => (isActive ? active : inactive)}
                  >
                    Jobs Manager
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* RIGHT */}
          <div>
            {!isAuthenticated ? (
              <NavLink
                to="/login"
                className={
                  isLoginActive
                    ? active
                    : "text-[11px] font-semibold tracking-[0.18em] uppercase text-black/50 hover:text-black"
                }
              >
                Login
              </NavLink>
            ) : (
              <button
                onClick={onLogout}
                className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-500 hover:text-red-600"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
