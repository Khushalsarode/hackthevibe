import React, { useState, useRef, useEffect } from "react";
import { Rocket } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <Rocket className="text-indigo-400" size={22} />
          <span>AI Launch Agent</span>
        </Link>

        {/* Conditional Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
              <Link to="/settings" className="hover:text-white transition">
                Settings
              </Link>
            </>
          )}
        </div>

        {/* Auth Section */}
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {!isAuthenticated ? (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-indigo-500 hover:bg-indigo-600 transition px-5 py-2 rounded-xl text-sm font-medium"
            >
              Login
            </button>
          ) : (
            <>
              {/* Avatar */}
              <button onClick={() => setIsOpen(!isOpen)}>
                <img
                  src={user?.picture}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-slate-700 hover:border-indigo-400 transition"
                />
              </button>

              {/* Quick Logout */}
              <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 top-14 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 space-y-3">
                  
                  <div className="text-sm">
                    <div className="font-semibold text-slate-200">
                      {user?.name}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {user?.email}
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 space-y-2 text-sm">
                    <Link
                      to="/dashboard"
                      className="block hover:text-indigo-400 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block hover:text-indigo-400 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <button
                      onClick={() =>
                        logout({ logoutParams: { returnTo: window.location.origin } })
                      }
                      className="w-full text-left text-sm text-red-400 hover:text-red-300 transition"
                    >
                      Logout
                    </button>
                  </div>

                </div>
              )}
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;