import React, { useState, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Roadmap = ({ project }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRoadmap = useCallback(async () => {
    if (!project) return;
    setLoading(true);
    setError(false);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Create a 7-day launch roadmap for this startup:
        Name: ${project.domainName}
        Tagline: ${project.tagline}

        For each day (1 to 7), provide:
        1. A 'title' for the day's focus.
        2. A 'task' description.
        3. A 'category' (Branding, Development, Marketing, or Legal).

        Return ONLY a JSON array of 7 objects:
        [
          {"day": 1, "title": "...", "task": "...", "category": "..."},
          ...
        ]
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        setTasks(JSON.parse(jsonMatch[0]));
      } else {
        throw new Error("Invalid Format");
      }
    } catch (err) {
      console.error("Roadmap Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="animate-spin inline-block w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <p className="text-slate-500 font-medium animate-pulse">Calculating your path to launch...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl">
        <h3 className="text-2xl font-bold text-white mb-2">The Launch Countdown</h3>
        <p className="text-slate-400 text-sm">A personalized 7-day execution plan for {project.domainName}.</p>
      </div>


      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800"></div>

        <div className="space-y-12 relative">
          {tasks.map((item) => (
            <div key={item.day} className="flex gap-8 group">
              {/* Day Circle */}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center transition-all group-hover:border-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Day</span>
                  <span className="text-xl font-bold text-white">{item.day}</span>
                </div>
              </div>

              {/* Task Content */}
              <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{item.task}</p>
                
                <div className="mt-4 flex items-center gap-2">
                   <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500" />
                   <label className="text-xs text-slate-500">Mark as complete</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;