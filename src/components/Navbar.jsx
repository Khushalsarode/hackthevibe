import React, { useState, useRef, useEffect } from "react";
import { Rocket, User, Layout, Settings, LogOut, Bookmark, Zap, Bell, Search, HelpCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
          <Rocket className="text-indigo-500 group-hover:rotate-12 transition-transform" size={24} />
          <span>LaunchAgent<span className="text-indigo-500">.ai</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/about" className="hover:text-white transition">About</Link>
            </>
          ) : (
            <>
              <Link to="/domainai" className="hover:text-white transition">Domain Studio</Link>
              <Link to="/status" className="hover:text-white transition">Project Pad</Link>
              <Link to="/bookmarks" className="hover:text-white transition flex items-center gap-1">
                <Bookmark size={14} /> Saved
              </Link>
            </>
          )}
        </div>

        {/* User Actions Section */}
        <div className="flex items-center gap-4 md:gap-6" ref={dropdownRef}>
          {!isAuthenticated ? (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white transition px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Get Started
            </button>
          ) : (
            <>
              {/* Utility Icons (Search/Help) */}
              <div className="hidden sm:flex items-center gap-4 text-slate-500">
                <button className="hover:text-indigo-400 transition-colors"><Search size={18} /></button>
                <button className="hover:text-indigo-400 transition-colors"><HelpCircle size={18} /></button>
              </div>

              {/* Notification Icon */}
              <button className="relative text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
                {/* Notification Ping Animation */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
              </button>

              {/* Profile Trigger */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative group focus:outline-none flex items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-slate-800 group-hover:border-indigo-500 transition-all shadow-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user.name; }} 
                      />
                    ) : (
                      <User size={20} className="text-slate-500" />
                    )}
                  </div>
                  {/* Online Status Dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                </button>

                {/* Account Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    <div className="px-4 py-3 mb-2 bg-slate-950/50 rounded-xl">
                      <p className="font-bold text-slate-100 truncate text-sm">{user?.name || "Founder"}</p>
                      <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                    </div>

                    <div className="space-y-1">
                      <DropdownLink to="/userprofile" icon={<User size={16} />} label="Account Settings" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/userdashboard" icon={<Layout size={16} />} label="My Projects" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/settings" icon={<Zap size={16} />} label="API Keys" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/bookmarks" icon={<Bookmark size={16} />} label="Saved Items" onClick={() => setIsDropdownOpen(false)} />
                    </div>

                    <div className="border-t border-slate-800 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const DropdownLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
  >
    {icon}
    <span className="flex-1">{label}</span>
  </Link>
);

export default Navbar;