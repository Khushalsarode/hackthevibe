import React, { useState, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const LaunchContent = ({ project }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchContent = useCallback(async () => {
    if (!project || !project.domainName) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      // FIXED: Using 1.5-flash for stability
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are a branding and viral marketing expert. Generate a comprehensive launch pack for this startup:
        Name: ${project.domainName}
        Concept: ${project.tagline}

        Provide the following in a valid JSON object:
        1. elevatorPitch: A 30-second persuasive pitch.
        2. twitterPosts: Array of 3 tweets.
        3. linkedinPost: A professional announcement.
        4. productHunt: { "tagline": "...", "desc": "..." }
        5. logoPrompt: A detailed, high-quality prompt for an AI image generator (like Midjourney) to create a professional, minimal, and modern logo for this brand.

        Return ONLY a raw JSON object (No markdown, no conversation):
        {
          "elevatorPitch": "...",
          "twitterPosts": ["...", "...", "..."],
          "linkedinPost": "...",
          "productHunt": { "tagline": "...", "desc": "..." },
          "logoPrompt": "..."
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        if (parsedData.elevatorPitch && parsedData.logoPrompt) {
          setContent(parsedData);
        } else {
          throw new Error("Missing fields");
        }
      } else {
        throw new Error("No valid JSON found");
      }
    } catch (err) {
      console.error("Launch Content Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    const toast = document.createElement('div');
    toast.innerText = "Copied!";
    toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold z-50 shadow-2xl animate-bounce";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="animate-spin inline-block w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <p className="text-slate-500 font-medium animate-pulse">Generating your viral assets...</p>
    </div>
  );

  if (error || !content) return (
    <div className="bg-slate-900 border border-red-900/20 p-16 rounded-3xl text-center space-y-4">
      <p className="text-red-400">Marketing engine timed out.</p>
      <button onClick={fetchContent} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition font-bold text-sm">🔄 Retry</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- LOGO PROMPT SECTION --- */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl border-l-4 border-l-emerald-500 group relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h3 className="text-xl font-bold text-white">AI Logo Prompt</h3>
          </div>
          <button onClick={() => copyToClipboard(content.logoPrompt)} className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:text-white transition">Copy Prompt</button>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 group-hover:border-emerald-500/30 transition">
          <p className="text-slate-400 text-sm italic leading-relaxed">"{content.logoPrompt}"</p>
        </div>
        <p className="text-[10px] text-slate-500 mt-4 text-center">Paste this into Midjourney, DALL-E, or Canva AI for the best results.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* --- ELEVATOR PITCH --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">The 30-Sec Pitch</h3>
            <button onClick={() => copyToClipboard(content.elevatorPitch)} className="text-[10px] text-indigo-400 font-bold uppercase">Copy</button>
          </div>
          <p className="text-slate-300 leading-relaxed italic">"{content.elevatorPitch}"</p>
        </div>

        {/* --- PRODUCT HUNT --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">😸</span>
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Product Hunt</h3>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-indigo-400 font-bold mb-1">{content.productHunt.tagline}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{content.productHunt.desc}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* --- TWITTER PACK --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">🐦 Launch Tweets</h3>
          <div className="space-y-4">
            {content.twitterPosts.map((tweet, i) => (
              <div key={i} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative group hover:border-indigo-500/50 transition">
                <p className="text-sm text-slate-400 leading-relaxed">{tweet}</p>
                <button onClick={() => copyToClipboard(tweet)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-slate-800 hover:bg-indigo-600 p-1.5 rounded-lg text-xs">📋</button>
              </div>
            ))}
          </div>
        </div>

        {/* --- LINKEDIN --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">💼 LinkedIn Post</h3>
            <button onClick={() => copyToClipboard(content.linkedinPost)} className="text-[10px] font-bold text-blue-400 uppercase">Copy</button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-800 h-full">{content.linkedinPost}</p>
        </div>
      </div>
    </div>
  );
};

export default LaunchContent;