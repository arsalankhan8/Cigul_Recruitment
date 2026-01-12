import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/cigul-logo.png";

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem("token");

  const isLoginActive = location.pathname === "/login";
  const isRolesActive =
    location.pathname === "/" || location.pathname === "/roles";

  const baseLink =
    "text-[11px] font-semibold tracking-[0.18em] uppercase transition";

  const inactive = `${baseLink} text-black/40 hover:text-black`;
  const active =
    "px-4 py-2 rounded-full bg-black text-white text-[11px] font-semibold tracking-[0.18em] uppercase";

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const closeOnScroll = () => setOpen(false);

    // close on any scroll (wheel/touch/trackpad)
    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [open]);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const MobileLink = ({ to, isActive, children }) => (
    <NavLink
      to={to}
      className={
        isActive
          ? "w-full px-4 py-3 rounded-2xl bg-black text-white text-[12px] font-semibold tracking-[0.18em] uppercase"
          : "w-full px-4 py-3 rounded-2xl bg-black/[0.03] text-black/70 hover:bg-black/[0.06] text-[12px] font-semibold tracking-[0.18em] uppercase"
      }
    >
      {children}
    </NavLink>
  );

  return (
    <header className="w-full bg-white border-b border-black/10 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-[72px] flex items-center justify-between">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-10">
            <NavLink to="/" className="flex items-center">
              <img src={logo} alt="Cigul Logo" className="h-10" />
            </NavLink>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink
                to="/roles"
                className={isRolesActive ? active : inactive}
              >
                Open Roles
              </NavLink>

              {/* <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? active : inactive)}
              >
                About Cigul
              </NavLink> */}

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

          {/* RIGHT: Desktop auth + Mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Desktop auth */}
            {/* <div className="hidden md:block">
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
            </div> */}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-black/10 bg-white hover:bg-black/[0.03]"
              aria-label="Open menu"
              aria-expanded={open}
            >
              {/* simple icon */}
              <div className="flex flex-col gap-1.5">
                <span
                  className={`h-0.5 w-5 bg-black transition ${
                    open ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-5 bg-black transition ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-5 bg-black transition ${
                    open ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* backdrop */}
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />

          {/* panel */}
          <div className="absolute top-[72px] left-0 right-0 bg-white border-t border-black/10 shadow-lg">
            <div className="mx-auto max-w-7xl px-6 py-4">
              <div className="flex flex-col gap-3">
                <MobileLink to="/roles" isActive={isRolesActive}>
                  Open Roles
                </MobileLink>

                {/* <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive
                      ? "w-full px-4 py-3 rounded-2xl bg-black text-white text-[12px] font-semibold tracking-[0.18em] uppercase"
                      : "w-full px-4 py-3 rounded-2xl bg-black/[0.03] text-black/70 hover:bg-black/[0.06] text-[12px] font-semibold tracking-[0.18em] uppercase"
                  }
                >
                  About Cigul
                </NavLink> */}

                {isAuthenticated && (
                  <>
                    <NavLink
                      to="/dashboard/pipeline"
                      className={({ isActive }) =>
                        isActive
                          ? "w-full px-4 py-3 rounded-2xl bg-black text-white text-[12px] font-semibold tracking-[0.18em] uppercase"
                          : "w-full px-4 py-3 rounded-2xl bg-black/[0.03] text-black/70 hover:bg-black/[0.06] text-[12px] font-semibold tracking-[0.18em] uppercase"
                      }
                    >
                      Pipeline
                    </NavLink>

                    <NavLink
                      to="/dashboard/jobs"
                      className={({ isActive }) =>
                        isActive
                          ? "w-full px-4 py-3 rounded-2xl bg-black text-white text-[12px] font-semibold tracking-[0.18em] uppercase"
                          : "w-full px-4 py-3 rounded-2xl bg-black/[0.03] text-black/70 hover:bg-black/[0.06] text-[12px] font-semibold tracking-[0.18em] uppercase"
                      }
                    >
                      Jobs Manager
                    </NavLink>
                  </>
                )}

                <div className="pt-2 border-t border-black/10">
                  {!isAuthenticated ? (
                    <NavLink
                      to="/login"
                      className={
                        isLoginActive
                          ? "w-full inline-flex justify-center px-4 py-3 rounded-2xl bg-black text-white text-[12px] font-semibold tracking-[0.18em] uppercase"
                          : "w-full inline-flex justify-center px-4 py-3 rounded-2xl bg-black/[0.03] text-black/70 hover:bg-black/[0.06] text-[12px] font-semibold tracking-[0.18em] uppercase"
                      }
                    >
                      Login
                    </NavLink>
                  ) : (
                    <button
                      onClick={() => {
                        setOpen(false);
                        onLogout?.();
                      }}
                      className="w-full px-4 py-3 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-500/15 text-[12px] font-semibold tracking-[0.18em] uppercase"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
