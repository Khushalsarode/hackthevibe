import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VisualIdentity = ({ project }) => {
  const [brandKit, setBrandKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVisualIdentity = async () => {
      // 1. Safety Guard: Check if project and domainName exist
      if (!project || !project.domainName) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
        // Ensure model name is correct (1.5-flash)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
          Generate a visual identity kit for this startup:
          Name: ${project.domainName}
          Tagline: ${project.tagline}

          Return ONLY a JSON object with this exact structure:
          {
            "colors": ["#primary", "#secondary", "#accent"],
            "fonts": ["Heading Font", "Body Font"],
            "logoPrompt": "detailed description for AI logo generator",
            "style": ["Modern", "Minimal", "Bold"]
          }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 2. Safety Guard: Robust JSON extraction (removes markdown backticks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          setBrandKit(parsedData);
        } else {
          throw new Error("Invalid JSON structure");
        }
      } catch (err) {
        console.error("Visual Identity Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVisualIdentity();
  }, [project]);

  // 3. UI State Guards
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-400 animate-pulse">Designing your visual DNA...</p>
      </div>
    );
  }

  if (error || !brandKit) {
    return (
      <div className="bg-red-900/10 border border-red-900/30 p-10 rounded-3xl text-center">
        <p className="text-red-400">Failed to generate brand kit. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- COLOR PALETTE --- */}
      
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Color Palette</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brandKit.colors?.map((color, i) => (
            <div key={i} className="group">
              <div 
                className="h-28 w-full rounded-2xl border border-white/10 shadow-lg transition transform group-hover:scale-105" 
                style={{ backgroundColor: color }}
              ></div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">{color}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(color)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* --- LOGO PROMPT --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-indigo-400">🖼️</span>
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">AI Logo Concept</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed italic bg-slate-950 p-5 rounded-2xl border border-slate-800">
            "{brandKit.logoPrompt}"
          </p>
        </div>

        {/* --- TYPOGRAPHY --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between">
          <div>
             <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-4">Typography</h3>
             <div className="space-y-1">
                <p className="text-3xl font-bold text-white">{brandKit.fonts?.[0]}</p>
                <p className="text-sm text-slate-500">Secondary: {brandKit.fonts?.[1]}</p>
             </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-2">
             {brandKit.style?.map((tag, i) => (
               <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualIdentity;