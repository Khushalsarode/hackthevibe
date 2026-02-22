import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ProjectStrategy = ({ project }) => {
  const [strategy, setStrategy] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingScores, setFetchingScores] = useState(true);

  useEffect(() => {
    const fetchFullStrategy = async () => {
      if (!project || !project.domainName) return;
      
      setLoading(true);
      setFetchingScores(true);

      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 🧠 PERSONALIZED STRATEGIC PROMPT
        const prompt = `
          Act as a world-class Venture Capitalist and Startup Strategist. 
          Analyze this specific project:
          - Domain: ${project.domainName}
          - Mission: ${project.tagline}
          - Context: ${project.metaDesc}

          Generate a highly personalized strategy in JSON format. 
          The advice must be specific to this industry, not generic.

          {
            "scores": {
              "memorability": number(0-100),
              "brandability": number(0-100),
              "pronunciation": number(0-100),
              "seo": number(0-100),
              "risk": number(0-100),
              "tone": number(0-100)
            },
            "details": {
              "marketPosition": "A professional 1-sentence 'Blue Ocean' positioning statement.",
              "targetAudience": ["3-5 specific, high-value customer personas"],
              "coreValues": ["3-5 unique brand pillars"],
              "competitiveEdge": "A deep-dive into the unique 'Unfair Advantage' for this specific name/concept.",
              "revenueModel": "The most viable path to $1M ARR for this specific concept.",
              "nextSteps": ["Step 1: Immediate Action", "Step 2: Growth Hack", "Step 3: Scaling"]
            }
          }
        `;

        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        const jsonStr = text.substring(start, end);
        
        if (jsonStr) {
          const data = JSON.parse(jsonStr);
          setScores(data.scores);
          setStrategy(data.details);
        }
      } catch (err) {
        console.error("CRITICAL ERROR:", err);
        setScores({ memorability: 0, brandability: 0, pronunciation: 0, seo: 0, risk: 0, tone: 0 });
      } finally {
        setLoading(false);
        setFetchingScores(false);
      }
    };

    fetchFullStrategy();
  }, [project]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 📊 SMART SCORING GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fetchingScores ? (
           [...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          <>
            <ScoreCard label="Memorability" score={scores?.memorability} icon="🧠" color="text-indigo-400" />
            <ScoreCard label="Brandability" score={scores?.brandability} icon="💎" color="text-purple-400" />
            <ScoreCard label="Pronunciation" score={scores?.pronunciation} icon="🗣️" color="text-blue-400" />
            <ScoreCard label="SEO Strength" score={scores?.seo} icon="📈" color="text-emerald-400" />
            <ScoreCard label="Market Risk" score={scores?.risk} icon="⚠️" color="text-amber-400" isRisk />
            <ScoreCard label="Tone Match" score={scores?.tone} icon="🎭" color="text-pink-400" />
          </>
        )}
      </div>

      {/* --- STRATEGIC DEEP DIVE --- */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Positioning & Roadmap */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl border-l-4 border-indigo-600 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-6xl text-white">🚀</span>
            </div>
            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Market Positioning</label>
            {loading ? <div className="h-10 bg-slate-800 animate-pulse mt-2 rounded-xl"></div> : (
              <p className="text-2xl text-white font-bold mt-2 leading-tight">"{strategy?.marketPosition}"</p>
            )}
          </div>


          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
             <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
               Personalized Growth Roadmap
             </label>
             <div className="mt-6 grid gap-4">
                {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-800 animate-pulse rounded-xl"></div>) : 
                  strategy?.nextSteps?.map((step, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition transform hover:-translate-y-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-300 font-medium">{step}</p>
                    </div>
                  ))
                }
             </div>
          </div>
        </div>

        {/* Right Column: High-Level Insights */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Revenue Model</label>
            {loading ? <div className="h-12 bg-slate-800 animate-pulse mt-2 rounded-xl"></div> : (
              <p className="text-xl text-white font-black mt-2">💰 {strategy?.revenueModel}</p>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Target Personas</label>
            <div className="mt-4 space-y-4">
              {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-10 bg-slate-800 animate-pulse rounded-xl"></div>) : 
                strategy?.targetAudience?.map((user, i) => (
                  <div key={i} className="text-sm text-slate-400 pl-4 border-l-2 border-slate-800 hover:border-purple-500 transition">
                    {user}
                  </div>
                ))
              }
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
            <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Core Brand Pillars</label>
            <div className="mt-4 flex flex-wrap gap-2">
               {strategy?.coreValues?.map((val, i) => (
                 <span key={i} className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-[10px] font-bold text-pink-400 uppercase tracking-tighter">
                   #{val}
                 </span>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// 🔹 Sub-component for Score Cards
const ScoreCard = ({ label, score, icon, color, isRisk }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all duration-300 group shadow-lg">
    <div className="flex justify-between items-start mb-3">
      <span className="text-xl group-hover:scale-120 transition-transform">{icon}</span>
      <span className={`text-xl font-bold ${color}`}>{score ?? 0}%</span>
    </div>
    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">{label}</p>
    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${isRisk ? (score > 40 ? 'bg-red-500' : 'bg-emerald-500') : 'bg-indigo-600'}`} 
        style={{ width: `${score ?? 0}%` }}
      ></div>
    </div>
  </div>
);

export default ProjectStrategy;