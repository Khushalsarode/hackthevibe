// src/components/FakeDomainPreview.jsx
import React, { useEffect, useState } from "react";

function FakeDomainPreview({ domainData, onClose }) {
  if (!domainData) return null;

  const { name, tagline, metaTitle, metaDesc } = domainData;

  const [device, setDevice] = useState("desktop"); // desktop | mobile

  const cleanDomain = name
    ?.toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9.-]/g, "");

  const fakeURL = `https://www.${cleanDomain}`;
  const logoText = cleanDomain?.split(".")[0] || "brand";

  // ESC close + disable background scroll
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[90vh] bg-slate-900 rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser Top Bar */}
        <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 border-b border-slate-700 shrink-0 rounded-t-2xl">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>

          <div className="flex-1 text-sm text-slate-400 bg-slate-700 rounded-md px-4 py-1 text-center truncate">
            {fakeURL}
          </div>

          {/* Device Toggle */}
          <div className="flex gap-2 mr-4">
            <button
              onClick={() => setDevice("desktop")}
              className={`px-3 py-1 text-xs rounded-md transition ${
                device === "desktop"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              🖥
            </button>

            <button
              onClick={() => setDevice("mobile")}
              className={`px-3 py-1 text-xs rounded-md transition ${
                device === "mobile"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              📱
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950 text-white flex justify-center">
          <div
            className={`w-full transition-all duration-300 ${
              device === "mobile" ? "max-w-[375px]" : "max-w-full"
            }`}
          >
            {/* Header */}
            <header
              className={`flex justify-between items-center border-b border-slate-800 ${
                device === "mobile" ? "px-4 py-4" : "px-8 py-6"
              }`}
            >
              <h1 className="text-xl font-bold text-indigo-400">
                {logoText}
              </h1>

              {device === "desktop" && (
                <nav className="flex gap-8 text-sm text-slate-300">
                  <a href="#" className="hover:text-white">
                    Home
                  </a>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </nav>
              )}
            </header>

            {/* Hero */}
            <section
              className={`text-center bg-gradient-to-br from-indigo-600/20 via-slate-900 to-slate-950 ${
                device === "mobile" ? "px-4 py-16" : "px-6 py-24"
              }`}
            >
              <h2
                className={`font-extrabold mb-6 leading-tight ${
                  device === "mobile"
                    ? "text-2xl"
                    : "text-4xl md:text-5xl"
                }`}
              >
                {tagline || "Launch Your Vision With Confidence"}
              </h2>

              <p
                className={`text-slate-400 mx-auto mb-10 ${
                  device === "mobile"
                    ? "text-sm max-w-xs"
                    : "text-lg max-w-2xl"
                }`}
              >
                {metaDesc ||
                  "A powerful and scalable platform built to elevate your digital presence."}
              </p>

              <div className="flex justify-center gap-4 flex-wrap">
                <button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold transition">
                  Get Started
                </button>

                {device === "desktop" && (
                  <button className="border border-slate-700 hover:border-white px-8 py-3 rounded-xl transition">
                    Learn More
                  </button>
                )}
              </div>
            </section>

            {/* Features */}
            <section
              className={`gap-8 ${
                device === "mobile"
                  ? "flex flex-col px-4 py-12"
                  : "grid md:grid-cols-3 px-10 py-20"
              }`}
            >
              <FeatureCard
                icon="⚡"
                title="Lightning Fast"
                description="Optimized infrastructure delivering unmatched speed."
                device={device}
              />
              <FeatureCard
                icon="🔒"
                title="Secure"
                description="Built with enterprise-grade security architecture."
                device={device}
              />
              <FeatureCard
                icon="📱"
                title="Fully Responsive"
                description="Seamless experience across all devices."
                device={device}
              />
            </section>

            {/* CTA */}
            <section className="text-center py-16 bg-slate-900 border-t border-slate-800">
              <h3 className="text-2xl font-bold mb-4">
                Ready to build with {logoText}?
              </h3>
              <button className="bg-indigo-500 hover:bg-indigo-600 px-10 py-3 rounded-xl font-semibold transition">
                Start Now
              </button>
            </section>

            {/* Footer */}
            <footer className="text-center py-8 text-slate-500 text-sm border-t border-slate-800">
              © {new Date().getFullYear()} {logoText}. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, device }) {
  return (
    <div
      className={`bg-slate-800 rounded-2xl text-center hover:scale-105 transition duration-300 ${
        device === "mobile" ? "p-5" : "p-8"
      }`}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-3 text-indigo-400">
        {title}
      </h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

export default FakeDomainPreview;