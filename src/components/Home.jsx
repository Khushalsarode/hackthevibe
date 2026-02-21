import React from "react";
import { Rocket, Brain, Globe, FileText, BarChart3 } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen">

      {/* HERO SECTION */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            From Idea to Launch-Ready Startup in Minutes.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            AI Launch Agent transforms your raw idea into a brand,
            documentation, and launch plan — instantly.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <button className="bg-indigo-500 hover:bg-indigo-600 transition px-6 py-3 rounded-xl font-medium">
              🚀 Generate My Launch Plan
            </button>

            <button className="border border-slate-700 hover:bg-slate-800 transition px-6 py-3 rounded-xl font-medium">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-14">
          <h2 className="text-3xl font-semibold tracking-tight">
            Why Great Ideas Never Launch
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Naming is Hard",
                desc: "Finding a unique, memorable domain feels overwhelming."
              },
              {
                title: "Branding Feels Confusing",
                desc: "Tone, messaging, and positioning slow founders down."
              },
              {
                title: "Documentation Blocks Momentum",
                desc: "README, privacy policies, and launch content take hours."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3"
              >
                <h3 className="text-xl font-medium">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-20 px-6 bg-slate-900/40">
        <div className="max-w-6xl mx-auto text-center space-y-14">
          <h2 className="text-3xl font-semibold tracking-tight">
            Meet Your AI Launch Co-Founder
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Brain size={22} />}
              title="Smart Positioning"
              desc="Instant market positioning & differentiation insights."
            />
            <FeatureCard
              icon={<Globe size={22} />}
              title="Domain & Brand Kit"
              desc="Available domains, slogans & visual identity."
            />
            <FeatureCard
              icon={<FileText size={22} />}
              title="Launch Content Pack"
              desc="Landing copy, social posts & elevator pitch."
            />
            <FeatureCard
              icon={<BarChart3 size={22} />}
              title="Readiness Score"
              desc="AI-evaluated launch confidence & roadmap."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-14">
          <h2 className="text-3xl font-semibold tracking-tight">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-left">
            {[
              "Describe your idea",
              "Choose your startup vibe",
              "Generate your launch kit",
              "Execute your 7-day roadmap"
            ].map((step, i) => (
              <div key={i} className="space-y-2">
                <div className="text-indigo-400 font-semibold">
                  Step {i + 1}
                </div>
                <p className="text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAUNCH SCORE PREVIEW */}
      <section className="py-20 px-6 bg-slate-900/40">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Launch Readiness Score
          </h2>

          <div className="flex flex-col items-center space-y-6">
            <div className="w-40 h-40 rounded-full border-8 border-indigo-500 flex items-center justify-center text-4xl font-bold">
              84%
            </div>

            <div className="w-full max-w-md space-y-4">
              <Progress label="Brand Clarity" value={90} />
              <Progress label="Messaging Strength" value={82} />
              <Progress label="Documentation" value={88} />
              <Progress label="Market Positioning" value={80} />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Ship Your Idea?
          </h2>

          <button className="bg-indigo-500 hover:bg-indigo-600 transition px-8 py-4 rounded-xl font-medium text-lg">
            🚀 Start Building
          </button>
        </div>
      </section>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left hover:border-indigo-500/40 transition">
    <div className="text-indigo-400">{icon}</div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);

const Progress = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm text-slate-400">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-slate-800 h-2 rounded-full">
      <div
        className="bg-indigo-500 h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default Home;