import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DocGenerator = ({ project }) => {
  const [activeDoc, setActiveDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const docTypes = [
    { id: "readme", label: "README.md", icon: "📖", prompt: "GitHub README with installation and tech stack" },
    { id: "privacy", label: "Privacy Policy", icon: "⚖️", prompt: "GDPR compliant Privacy Policy for a startup" },
    { id: "tos", label: "Terms of Service", icon: "📝", prompt: "Terms of Service agreement for users" },
    { id: "security", label: "Security.md", icon: "🛡️", prompt: "Vulnerability reporting and security protocols" },
  ];

  const generateDoc = async (type) => {
    setLoading(true);
    setActiveDoc(type.id);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Act as a professional legal and technical writer. 
        Generate a detailed ${type.label} for the following startup:
        Project Name: ${project.domainName}
        Concept: ${project.tagline}
        Requirements: ${type.prompt}

        Return the content in professional Markdown format. Include placeholders like [DATE] or [CONTACT EMAIL] where necessary.
      `;

      const result = await model.generateContent(prompt);
      setGeneratedContent(result.response.text());
    } catch (err) {
      console.error("Doc Generation failed", err);
      setGeneratedContent("Error generating document. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const downloadDoc = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeDoc.toUpperCase()}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {docTypes.map((doc) => (
          <button
            key={doc.id}
            onClick={() => generateDoc(doc)}
            disabled={loading}
            className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${
              activeDoc === doc.id 
              ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20" 
              : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <span className="text-2xl">{doc.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{doc.label}</span>
          </button>
        ))}
      </div>

      {/* Preview Area */}
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {loading ? "Generating..." : activeDoc ? `${activeDoc}.md Preview` : "Select a document type"}
            </span>
          </div>
          {generatedContent && !loading && (
            <button 
              onClick={downloadDoc}
              className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold transition"
            >
              Download File
            </button>
          )}
        </div>

        <div className="p-8 min-h-[400px] bg-slate-950/50 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : generatedContent ? (
            <pre className="text-sm font-mono text-slate-400 leading-relaxed whitespace-pre-wrap">
              {generatedContent}
            </pre>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
              <p>Select a document type above to generate your startup assets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocGenerator;