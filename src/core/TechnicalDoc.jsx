import React, { useState, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TechnicalDocs = ({ project }) => {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDocs = useCallback(async () => {
    if (!project) return;
    setLoading(true);
    setError(false);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        As a Senior Software Architect, generate a technical documentation pack for this startup project:
        Name: ${project.domainName}
        Concept: ${project.tagline}

        Provide the following in a valid JSON object:
        1. readme: A full, professional GitHub README.md content including sections like Introduction, Tech Stack, Installation, and License.
        2. contributing: Content for a CONTRIBUTING.md file.
        3. architecture: A markdown representation of the suggested folder structure.

        Return ONLY a raw JSON object:
        {
          "readme": "...",
          "contributing": "...",
          "architecture": "..."
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        setDocs(JSON.parse(jsonMatch[0]));
      } else {
        throw new Error("Invalid Response");
      }
    } catch (err) {
      console.error("Docs Generation Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Function to download Markdown file
  const downloadFile = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="animate-spin inline-block w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      <p className="text-slate-500 font-medium animate-pulse">Architecting your codebase structure...</p>
    </div>
  );

  if (error) return <div className="p-10 text-center text-red-400">Failed to generate docs. <button onClick={fetchDocs} className="underline">Retry</button></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- REPOSITORY BLUEPRINT --- */}
      
      <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Repository Blueprint</h3>
          <p className="text-sm text-slate-400">Production-ready markdown files for your GitHub repo.</p>
        </div>
        <button 
          onClick={() => {
            downloadFile("README.md", docs.readme);
            downloadFile("CONTRIBUTING.md", docs.contributing);
            downloadFile("ARCHITECTURE.md", docs.architecture);
          }}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20"
        >
          Download All (.zip)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* --- README PREVIEW --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">README.md</span>
            <button onClick={() => downloadFile("README.md", docs.readme)} className="text-[10px] font-bold text-indigo-400 hover:text-white transition">Download</button>
          </div>
          <div className="p-8 max-h-[400px] overflow-y-auto font-mono text-sm text-slate-400 leading-relaxed scrollbar-hide">
            <pre className="whitespace-pre-wrap">{docs.readme}</pre>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* --- ARCHITECTURE --- */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Folder Structure</span>
              <button onClick={() => downloadFile("ARCHITECTURE.md", docs.architecture)} className="text-[10px] font-bold text-indigo-400">Download</button>
            </div>
            <div className="p-8 font-mono text-xs text-emerald-500 bg-slate-950/50">
              <pre className="whitespace-pre-wrap">{docs.architecture}</pre>
            </div>
          </div>

          {/* --- CONTRIBUTING --- */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">CONTRIBUTING.md</span>
              <button onClick={() => downloadFile("CONTRIBUTING.md", docs.contributing)} className="text-[10px] font-bold text-indigo-400">Download</button>
            </div>
            <div className="p-8 text-xs text-slate-500 leading-relaxed italic">
              <pre className="whitespace-pre-wrap">{docs.contributing.substring(0, 300)}...</pre>
              <p className="mt-4 text-indigo-400 font-bold">Open file to see full guidelines.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDocs;