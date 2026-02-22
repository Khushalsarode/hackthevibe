export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Turn Your Idea Into a
            <span className="text-indigo-400"> Launch-Ready Startup</span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            AI Launch Agent helps you generate branding, positioning,
            documentation, and launch content — all in minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-500 transition px-8 py-3 rounded-2xl font-medium shadow-lg">
              Get Started
            </button>
            <button className="border border-gray-600 hover:border-gray-400 transition px-8 py-3 rounded-2xl font-medium">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="bg-[#111827] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#1E293B] rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-indigo-400">
              Smart Positioning
            </h3>
            <p className="mt-3 text-gray-400">
              Clarify your problem statement, audience, and differentiation
              with AI-driven insights.
            </p>
          </div>

          <div className="p-6 bg-[#1E293B] rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-indigo-400">
              Brand & Domain Generator
            </h3>
            <p className="mt-3 text-gray-400">
              Get unique startup names, taglines, brand stories, and domain
              ideas instantly.
            </p>
          </div>

          <div className="p-6 bg-[#1E293B] rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-indigo-400">
              Launch Toolkit
            </h3>
            <p className="mt-3 text-gray-400">
              Generate landing page copy, README templates, legal drafts, and
              a 7-day launch roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AI Launch Agent. All rights reserved.
      </footer>
    </div>
  );
}
