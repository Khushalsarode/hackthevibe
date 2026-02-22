import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ProjectChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi. I'm your AI Launch Assistant." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [muted, setMuted] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🎤 START CONTINUOUS LISTENING
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.onend = () => {
      if (continuousMode) {
        recognition.start();
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    setContinuousMode(false);
  };

  // 🔊 TEXT TO SPEECH
  const speakResponse = (text) => {
    if (muted) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  // 🧠 GEMINI CALL
  const handleSend = async (voiceInput = null) => {
    const finalInput = voiceInput || input;
    if (!finalInput.trim()) return;

    // Capture current messages for the prompt before updating state
    const currentMessages = [...messages, { role: "user", text: finalInput }];
    setMessages(currentMessages);
    setInput("");
    setLoading(true);

    try {
      const key = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
      const genAI = new GoogleGenerativeAI(key);

      // Model name fixed to 1.5-flash
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
You are the official AI Assistant for a project called **AI Launch Agent**, built for the Hack the Vibe 36-hour hackathon.

===============================
🔷 PROJECT OVERVIEW
===============================
AI Launch Agent is an intelligent startup companion that transforms a raw idea into a launch-ready brand, documentation set, and execution roadmap in minutes.
It removes friction between: IDEA → BRAND → CONTENT → DOCUMENTATION → LAUNCH

===============================
🔷 CORE FEATURES
===============================
1️⃣ Startup Positioning Intelligence, 2️⃣ Smart Domain & Branding, 3️⃣ SEO & Marketing Pack, 4️⃣ Visual Identity, 5️⃣ Technical & Legal Launch Pack, 6️⃣ Launch Readiness Score, 7️⃣ 7-Day Launch Plan.

===============================
🔷 YOUR ROLE
===============================
Strategic, Startup-focused, Practical, Clear. Help users use AI Launch Agent effectively. Redirect unrelated questions back to startup context.

===============================
🔷 CONVERSATION MEMORY
===============================
Conversation so far:
${currentMessages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n")}

===============================
🔷 USER QUESTION
===============================
${finalInput}

Provide a high-quality, startup-focused response.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text() || "No response generated.";

      setMessages(prev => [...prev, { role: "bot", text }]);
      speakResponse(text);

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "AI response failed. Please check your API key and model name." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-xl z-50 transition"
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[560px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 backdrop-blur-xl">

          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-4 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-white">AI Launch Assistant</h2>
              <p className="text-xs text-indigo-100">Voice Enabled Co-Founder</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white">✕</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-indigo-600 ml-auto text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-slate-800 p-3 rounded-2xl w-fit animate-pulse text-slate-400">
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {listening && (
            <div className="absolute bottom-28 right-8 flex items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-30 animate-ping"></div>
                <div className="absolute inset-2 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  🎙
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-slate-800 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-slate-900 px-3 py-2 rounded-xl outline-none text-slate-200 border border-slate-700 focus:border-indigo-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your startup..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-white transition"
              >
                Send
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              <button
                onClick={() => {
                  setContinuousMode(true);
                  startListening();
                }}
                className={`hover:text-indigo-400 transition ${continuousMode ? 'text-indigo-400' : ''}`}
              >
                🎙 Continuous
              </button>
              <button onClick={stopListening} className="hover:text-red-400 transition">⏹ Stop</button>
              <button
                onClick={() => setMuted(!muted)}
                className={`transition ${muted ? "text-red-400" : "hover:text-indigo-400"}`}
              >
                {muted ? "🔇 Muted" : "🔊 Voice On"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectChatbot;