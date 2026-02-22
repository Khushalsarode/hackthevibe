import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MVPPreview = ({ project, brandKit }) => {
  const [activePage, setActivePage] = useState("landing");
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const primaryColor = brandKit?.colors?.[0] || "#6366f1";
  const secondaryColor = brandKit?.colors?.[1] || "#1e293b";

  useEffect(() => {
    const generatePageContent = async () => {
      setLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
          Generate website content for 3 pages for a startup called "${project.domainName}".
          Tagline: ${project.tagline}
          
          Return ONLY a JSON object:
          {
            "landing": { "heroTitle": "...", "subText": "...", "cta": "..." },
            "features": [
              { "title": "...", "desc": "...", "icon": "🚀" },
              { "title": "...", "desc": "...", "icon": "⚡" },
              { "title": "...", "desc": "...", "icon": "🛡️" }
            ],
            "pricing": { "planName": "Pro", "price": "$19", "features": ["a", "b", "c"] }
          }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) setPageData(JSON.parse(jsonMatch[0]));
      } catch (err) {
        console.error("MVP Generation failed", err);
      } finally {
        setLoading(false);
      }
    };

    generatePageContent();
  }, [project]);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Building your MVP preview...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Browser Chrome */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
          </div>
          
          {/* Internal Navigation Bar */}
          <nav className="flex gap-6">
            {["landing", "features", "pricing"].map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`text-[10px] uppercase font-black tracking-widest transition ${
                  activePage === page ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
          
          <div className="w-20"></div>
        </div>

        {/* Viewport Content */}
        <div className="min-h-[600px] bg-slate-950 p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
          
          {/* Background Glow */}
          <div className="absolute top-0 w-full h-full opacity-10 pointer-events-none" 
               style={{ background: `radial-gradient(circle at center, ${primaryColor}, transparent)` }}></div>

          {activePage === "landing" && (
            <div className="relative z-10 max-w-3xl space-y-6 animate-in zoom-in-95 duration-500">
              <h1 className="text-6xl font-black text-white leading-none">
                {pageData?.landing.heroTitle}
              </h1>
              <p className="text-xl text-slate-400 max-w-xl mx-auto">
                {pageData?.landing.subText}
              </p>
              <button 
                className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl transform transition hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                {pageData?.landing.cta}
              </button>
            </div>
          )}

          {activePage === "features" && (
            <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-3 gap-6 animate-in slide-in-from-right-8 duration-500">
              {pageData?.features.map((f, i) => (
                <div key={i} className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl text-left hover:border-slate-700 transition">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activePage === "pricing" && (
            <div className="relative z-10 w-full max-w-sm animate-in slide-in-from-bottom-8 duration-500">
              <div className="p-10 bg-slate-900 border-2 rounded-3xl" style={{ borderColor: primaryColor }}>
                <h3 className="text-indigo-400 font-black uppercase text-xs tracking-widest">{pageData?.pricing.planName}</h3>
                <div className="flex items-end justify-center gap-1 my-4">
                  <span className="text-5xl font-bold text-white">{pageData?.pricing.price}</span>
                  <span className="text-slate-500 mb-2">/mo</span>
                </div>
                <div className="space-y-4 mb-8">
                  {pageData?.pricing.features.map((item, i) => (
                    <div key={i} className="text-sm text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                       <span className="text-emerald-500">✓</span> {item}
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 rounded-xl font-bold text-white" style={{ backgroundColor: primaryColor }}>
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Meta info */}
      <div className="flex justify-between items-center px-4">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Live Preview: {project.domainName}</p>
         </div>
         <p className="text-[10px] text-slate-600">Context-aware rendering using Gemini 1.5</p>
      </div>
    </div>
  );
};

export default MVPPreview;