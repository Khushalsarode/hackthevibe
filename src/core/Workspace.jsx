import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Components
import VisualIdentity from "./VisualIdentity";
import LaunchContent from "./LaunchContent";
import ProjectStrategy from "./ProjectStrategy";
import TechnicalDocs from "./TechnicalDoc";
import Roadmap from "./Roadmap";
import MVPPreview from "./MVPPreview";
import DocGenerator from "./DocGenerator";

const Workspace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("strategy");

  useEffect(() => {
    if (location.state?.data) {
      setProject(location.state.data);
    } else {
      navigate("/bookmarks");
    }
  }, [location.state, navigate]);

  // --- ZIP EXPORT LOGIC ---
  
  const exportToZip = async () => {
    if (!project) return;
    
    const zip = new JSZip();
    const folder = zip.folder(`${project.domainName}_StarterKit`);

    // 1. Project Strategy & Data
    const strategyText = `
# Project Strategy: ${project.domainName}
Tagline: ${project.tagline}
Meta Title: ${project.metaTitle}
Meta Description: ${project.metaDesc}

Generated via AI Launch Workspace.
    `;
    folder.file("Strategy.md", strategyText);

    // 2. Placeholder for other docs (You can pass actual state here if shared)
    folder.file("README.md", `# ${project.domainName}\n${project.tagline}`);

    // Generate the ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${project.domainName}_LaunchPack.zip`);
  };

  if (!project) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading Workspace...</div>;

  const menuItems = [
    { id: "strategy", label: "Project Strategy", icon: "🎯" },
    { id: "branding", label: "Visual Identity", icon: "🎨" },
    { id: "content", label: "Launch Content", icon: "📢" },
    { id: "docs", label: "Technical Docs", icon: "📄" },
    { id: "roadmap", label: "7-Day Roadmap", icon: "🚀" },
    { id: "mvp", label: "MVP Preview", icon: "🌐" },
    { id: "doc", label: "Legal Docs", icon: "⚖️" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Workspace</p>
          <h2 className="text-xl font-bold text-white truncate">{project.domainName}</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white capitalize">{activeTab.replace("-", " ")}</h2>
            
            {/* --- UPDATED BUTTON --- */}
            <button 
              onClick={exportToZip}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-tighter shadow-lg shadow-indigo-600/20 transition transform active:scale-95"
            >
              📦 Export All Assets (.zip)
            </button>
          </div>

          <div className="animate-in fade-in duration-500">
            {activeTab === "strategy" && <ProjectStrategy project={project} />}
            {activeTab === "branding" && <VisualIdentity project={project} />}
            {activeTab === "content" && <LaunchContent project={project} />}
            {activeTab === "docs" && <TechnicalDocs project={project} />}
            {activeTab === "doc" && project && (
              <div className="space-y-12">
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl">
                  <h3 className="text-2xl font-bold text-white mb-2">Technical & Legal Suite</h3>
                  <p className="text-slate-400 text-sm">Generate the necessary paperwork and documentation to ship {project.domainName}.</p>
                </div>
                <DocGenerator project={project} />
              </div>
            )}
            {activeTab === "roadmap" && project && <Roadmap project={project} />}
            {activeTab === "mvp" && project && <MVPPreview project={project} />}
            
            {!["strategy", "branding", "content", "docs", "roadmap", "mvp", "doc"].includes(activeTab) && (
              <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-3xl text-slate-500 italic">
                Initializing {activeTab}...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;