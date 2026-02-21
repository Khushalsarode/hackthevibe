import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";

const Dashboard = () => <div className="p-10">Dashboard Page</div>;
const Settings = () => <div className="p-10">Settings Page</div>;
const About = () => <div className="p-10">About Page</div>;

function App() {
  return (
    <Router>
      <div className="bg-slate-950 text-slate-200 min-h-screen flex flex-col">
        <Navbar />

        <div className="pt-24 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;