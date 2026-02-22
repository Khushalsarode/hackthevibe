import React from "react";
import { Cpu, Target, Zap, Shield, Users, Rocket, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen">
      {/* --- VISION HEADER --- */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            The World Doesn't Lack Ideas. <br />
            <span className="text-indigo-500">It Lacks Momentum.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            LaunchAgent.ai was built to bridge the gap between "what if" and "here it is." 
            We architect your entire startup foundation in under 60 seconds.
          </p>
        </div>
      </section>

      {/* --- CORE MISSION --- */}
      <section className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="text-indigo-500" /> Our Mission
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Founding a company is hard enough without the cognitive friction of 
              naming, branding, and documenting. We believe founders should spend 
              their time building features, not writing privacy policies.
            </p>
            
            <div className="space-y-6">
              <MissionItem 
                icon={<Cpu size={20} />} 
                title="AI Architecture"
                desc="Using LLMs to generate structured, production-ready assets."
              />
              <MissionItem 
                icon={<Zap size={20} />} 
                title="Zero-to-One Speed"
                desc="Reducing the launch cycle from weeks to minutes."
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-950 border border-slate-800 p-10 rounded-3xl">
               <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-indigo-400" size={24} />
                  <h3 className="text-xl font-bold text-white">The AI Edge</h3>
               </div>
               <p className="text-slate-400 italic font-mono text-sm leading-relaxed">
                "Our agent doesn't just predict text. It synthesizes market positioning, 
                visual psychology, and legal compliance into a single source of truth."
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-white">The Three Pillars</h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <PillarCard 
            icon={<Shield className="text-emerald-400" />}
            title="Reliability"
            desc="Docs generated with legal-standard templates and tech-industry best practices."
          />
          <PillarCard 
            icon={<Users className="text-indigo-400" />}
            title="Founder Focus"
            desc="Built by builders, for builders. We prioritize speed and actionable output."
          />
          <PillarCard 
            icon={<Rocket className="text-purple-400" />}
            title="Launch-Ready"
            desc="Exportable Markdown and Zip files that go directly into your GitHub repo."
          />
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Ready to stop talking <br /> and start shipping?
          </h2>
          <button className="bg-indigo-600 hover:bg-indigo-500 transition-all px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-indigo-600/20 active:scale-95">
            Create Your Startup Kit
          </button>
        </div>
      </section>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const MissionItem = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  </div>
);

const PillarCard = ({ icon, title, desc }) => (
  <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-6 hover:border-slate-600 transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default About;