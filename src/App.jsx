import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import DomainAI from "./features/DomainAI";
import DomainStatus from "./features/DomainStatus";
import UserBookmarks from "./features/UserBookmarks";
import ProjectChatbot from "./components/ProjectChatbot";
import BackToTop from "./utility/BackToTop";
import Workspace from "./core/Workspace";
import UserProfile from "./user/UserProfile";
import Settings from "./user/Settings";
import UserDashboard from "./user/UserDashboard";
import About from "./components/About";
function App() {
  return (
    <Router>
      <div className="bg-slate-950 text-slate-200 min-h-screen flex flex-col">
        <Navbar />

        <div className="pt-24 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Change 'Dashboard' to 'UserDashboard' or ensure Dashboard is imported */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/domainai" element={<DomainAI />} />
            <Route path="/status" element={<DomainStatus />} />
            <Route path="/bookmarks" element={<UserBookmarks />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <ProjectChatbot />
        <BackToTop />
        <Footer />
      </div>
    </Router>
  );
}

export default App;