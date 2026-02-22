import React from "react";
import { Rocket, Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white group">
              <Rocket className="text-indigo-500 group-hover:rotate-12 transition-transform" size={24} />
              <span>LaunchAgent<span className="text-indigo-500">.ai</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              The automated co-founder for modern builders. We transform raw ideas into 
              launch-ready startups with AI-driven branding, strategy, and documentation.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Github size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Platform</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/domainai">Domain Studio</FooterLink>
              <FooterLink to="/status">Project Pad</FooterLink>
              <FooterLink to="/roadmap">Roadmap AI</FooterLink>
              <FooterLink to="/mvp">MVP Preview</FooterLink>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Resources</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/docs">Documentation</FooterLink>
              <FooterLink to="/about">Our Vision</FooterLink>
              <FooterLink to="/support">Community</FooterLink>
              <li className="flex items-center gap-1 group cursor-pointer hover:text-white transition">
                <span>API Status</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Legal</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">Contact</h3>
            <button className="flex items-center gap-2 text-sm hover:text-white transition group">
              <Mail size={16} className="text-indigo-500" />
              <span>Support Email</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-600">
            © {currentYear} LaunchAgent.ai • Built for Hack the Vibe
          </p>
          <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
            <span className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Vibe: Coding
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-purple-500" />
              Mode: Hypergrowth
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Components ---

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-white transition-colors flex items-center gap-1 group">
      {children}
      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  </li>
);

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-indigo-500 hover:text-white transition-all shadow-lg"
  >
    {icon}
  </a>
);