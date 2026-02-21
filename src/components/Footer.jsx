import React from "react";
import { Rocket, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-14">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Rocket className="text-indigo-400" size={22} />
              <span>AI Launch Agent</span>
            </div>
            <p className="text-slate-400 text-sm">
              From idea to launch-ready startup in minutes. Built for founders,
              hackers, and creators who ship fast.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-slate-300">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#score" className="hover:text-white transition">Launch Score</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-slate-300">
              Connect
            </h4>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AI Launch Agent. Built during Hack the Vibe 🚀
        </div>

      </div>
    </footer>
  );
};

export default Footer;