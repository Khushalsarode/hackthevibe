import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Papa from "papaparse";
import { useAuth0 } from "@auth0/auth0-react";
import FakeDomainPreview from "./FakeDomainPreview";

const DomainAI = () => {
    const { user } = useAuth0();

    const [industries, setIndustries] = useState([]);
    const [extensions, setExtensions] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [selectedExtensions, setSelectedExtensions] = useState([]);
    const [customTLD, setCustomTLD] = useState("");
    const [showCustomTLD, setShowCustomTLD] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [primaryKeywords, setPrimaryKeywords] = useState(["", "", ""]);
    const [secondaryKeywords, setSecondaryKeywords] = useState(["", "", ""]);
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewDomainData, setPreviewDomainData] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [availabilityStatus, setAvailabilityStatus] = useState({});

    // New states for the Prompt Feature
    const [usePromptMode, setUsePromptMode] = useState(false);
    const [simplePrompt, setSimplePrompt] = useState("");

    // ---------------- Fetch Industry + Extensions ----------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [industryRes, extensionRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/industries"),
                    axios.get("http://localhost:5000/api/extensions"),
                ]);

                setIndustries(
                    industryRes.data.map((ind) => ({
                        value: ind.Industry,
                        label: ind.Industry,
                    }))
                );

                setExtensions(
                    extensionRes.data.map((ext) => ({
                        value: ext.Extension,
                        label: ext.Extension,
                    }))
                );
            } catch (error) {
                console.error(error);
                alert("Failed to load industries/extensions");
            }
        };

        fetchData();
    }, []);

    // ---------------- Generate ----------------
    const handleGenerate = async () => {
        // Validation based on mode
        if (!usePromptMode) {
            if (!projectTitle || !projectDescription || !selectedIndustry) {
                alert("Fill all required fields");
                return;
            }
        } else {
            if (!simplePrompt.trim()) {
                alert("Please enter a prompt");
                return;
            }
        }

        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(
                import.meta.env.VITE_GOOGLE_GENAI_API_KEY
            );

            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash", // Updated to a stable versioning string
            });

            let finalPrompt = "";

            if (!usePromptMode) {
                const keywordStr = [
                    ...primaryKeywords.filter(Boolean),
                    ...secondaryKeywords.filter(Boolean),
                ].join(", ");

                const tldStr = [
                    ...selectedExtensions.map((ext) => ext.value),
                    ...(customTLD ? [customTLD] : []),
                ].join(", ");

                finalPrompt = `
Suggest 5 creative domain names for:
Project: ${projectTitle}
Industry: ${selectedIndustry.value}
Description: ${projectDescription}
Keywords: ${keywordStr}
Extensions: ${tldStr || "Any"}
`;
            } else {
                finalPrompt = `Suggest 5 creative domain names based on this request: ${simplePrompt}`;
            }

            // Append strict formatting to ensure parser works for both modes
            finalPrompt += `
Format strictly:

**1. DomainName.com**
Tagline: ...
SEO Meta Title: ...
SEO Meta Description: ...
`;

            const result = await model.generateContent(finalPrompt);
            const text = result?.response?.text?.();

            setAiResponse(text || "No response");
        } catch (err) {
            console.error(err);
            alert("AI Generation failed.");
        } finally {
            setLoading(false);
        }
    };

    const DOMAIN_CHECK_KEY = import.meta.env.VITE_DOMAIN_CHECK_KEY;

    const checkAvailability = async (domainName, index) => {
        setAvailabilityStatus(prev => ({
            ...prev,
            [index]: "loading"
        }));

        try {
            const response = await fetch(
                `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${DOMAIN_CHECK_KEY}&domainName=${domainName}&outputFormat=json`
            );

            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            const whois = data?.WhoisRecord;
            const registrant = whois?.registryData?.registrant;

            if (whois && whois.registryData && registrant) {
                setAvailabilityStatus(prev => ({
                    ...prev,
                    [index]: "taken"
                }));
            } else {
                setAvailabilityStatus(prev => ({
                    ...prev,
                    [index]: "available"
                }));
            }

        } catch (err) {
            setAvailabilityStatus(prev => ({
                ...prev,
                [index]: "error"
            }));
        }
    };

    // ---------------- Parse Response ----------------
    const parseDomains = () => {
        if (!aiResponse) return [];

        const lines = aiResponse
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

        const blocks = [];

        for (let i = 0; i < lines.length; i++) {
            if (/^\*\*\d+\.\s.+\*\*$/.test(lines[i])) {
                const name = lines[i].replace(/\*\*/g, "").split(". ").slice(1).join(". ");
                blocks.push({
                    name,
                    tagline: lines[i + 1]?.replace("Tagline:", "").trim(),
                    metaTitle: lines[i + 2]?.replace("SEO Meta Title:", "").trim(),
                    metaDesc: lines[i + 3]?.replace("SEO Meta Description:", "").trim(),
                });
            }
        }

        return blocks;
    };

    const exportSingleMD = (block) => {
        const content = `
# ${block.name}

## Tagline
${block.tagline}

## SEO Title
${block.metaTitle}

## SEO Description
${block.metaDesc}
`;

        const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${block.name}.md`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            alert("Copy failed. Please copy manually.");
        }
    };

    const handleBookmark = async (block) => {
        if (!user?.sub) {
            alert("Please login to bookmark domains.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/bookmarks", {
                userId: user.sub,
                domainName: block.name,
                tagline: block.tagline,
                metaTitle: block.metaTitle,
                metaDesc: block.metaDesc
            });

            alert("Domain bookmarked successfully!");

        } catch (error) {
            console.error("Bookmark error:", error);
            alert("Bookmark failed.");
        }
    };

    // ---------------- UI ----------------
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
            <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-10 shadow-xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold tracking-tight">
                            🧠 Domain AI Generator
                        </h1>
                        <p className="text-slate-400">
                            Generate brandable, SEO-optimized domain names instantly.
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                        <button 
                            onClick={() => setUsePromptMode(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!usePromptMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Form
                        </button>
                        <button 
                            onClick={() => setUsePromptMode(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${usePromptMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Simple Prompt
                        </button>
                    </div>
                </div>

                {/* Form Section */}
                {!usePromptMode ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm mb-2 text-slate-400">Project Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. EduSync"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2 text-slate-400">Project Description *</label>
                                <textarea
                                    rows="4"
                                    placeholder="Describe your project..."
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2 text-slate-400">Select Industry *</label>
                                <Select
                                    options={industries}
                                    value={selectedIndustry}
                                    onChange={setSelectedIndustry}
                                    placeholder="Choose industry"
                                    styles={{
                                        control: (base) => ({ ...base, backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }),
                                        singleValue: (base) => ({ ...base, color: 'white' }),
                                        menu: (base) => ({ ...base, backgroundColor: '#1e293b' }),
                                        option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#4f46e5' : '#1e293b', color: 'white' })
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm mb-2 text-slate-400">Primary Keywords (Max 3)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {primaryKeywords.map((k, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={k}
                                            onChange={(e) => {
                                                const updated = [...primaryKeywords];
                                                updated[i] = e.target.value;
                                                setPrimaryKeywords(updated);
                                            }}
                                            className="bg-slate-800 border border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-2 text-slate-400">Secondary Keywords</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {secondaryKeywords.map((k, i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={k}
                                            onChange={(e) => {
                                                const updated = [...secondaryKeywords];
                                                updated[i] = e.target.value;
                                                setSecondaryKeywords(updated);
                                            }}
                                            className="bg-slate-800 border border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm text-slate-400">Domain Extensions</label>
                                    <button
                                        onClick={() => setShowCustomTLD(!showCustomTLD)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        {showCustomTLD ? "← Back to list" : "Use Custom TLD"}
                                    </button>
                                </div>
                                {!showCustomTLD ? (
                                    <Select
                                        isMulti
                                        options={extensions}
                                        value={selectedExtensions}
                                        onChange={setSelectedExtensions}
                                        placeholder="Select extensions"
                                        styles={{
                                            control: (base) => ({ ...base, backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }),
                                            multiValue: (base) => ({ ...base, backgroundColor: '#4f46e5' }),
                                            multiValueLabel: (base) => ({ ...base, color: 'white' }),
                                            menu: (base) => ({ ...base, backgroundColor: '#1e293b' }),
                                            option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#4f46e5' : '#1e293b', color: 'white' })
                                        }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder=".ai, .dev, .io"
                                        value={customTLD}
                                        onChange={(e) => setCustomTLD(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Simple Prompt View */
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <label className="block text-sm text-slate-400">Describe what you need in plain English *</label>
                        <textarea
                            rows="8"
                            placeholder="e.g. I want to build a fitness app for busy professionals that focuses on 15-minute home workouts. Suggest some modern .io or .com domains with a techy feel."
                            value={simplePrompt}
                            onChange={(e) => setSimplePrompt(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-5 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}

                {/* Generate Button */}
                <div className="text-center pt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-indigo-500 hover:bg-indigo-600 px-10 py-4 rounded-2xl text-lg font-semibold transition disabled:opacity-50"
                    >
                        {loading ? "Generating..." : "🚀 Generate Domains"}
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {loading && (
                        <div className="text-center text-slate-400">
                            Generating smart suggestions...
                        </div>
                    )}

                    {!loading && parseDomains().length === 0 && (
                        <div className="text-center text-slate-500">
                            No suggestions yet. {usePromptMode ? "Enter a prompt" : "Fill the form"} and generate!
                        </div>
                    )}

                    {parseDomains().map((block, index) => (
                        <div
                            key={index}
                            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3 hover:border-indigo-500 transition"
                        >
                            <h3 className="text-xl font-semibold text-indigo-400">
                                {block.name}
                            </h3>

                            <p><span className="font-medium">Tagline:</span> {block.tagline}</p>
                            <p><span className="font-medium">SEO Title:</span> {block.metaTitle}</p>
                            <p><span className="font-medium">SEO Description:</span> {block.metaDesc}</p>

                            <div className="flex gap-3 pt-3 flex-wrap">
                                <button
                                    onClick={() => handleCopy(block.name, index)}
                                    className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                                >
                                    {copiedIndex === index ? "Copied!" : "Copy"}
                                </button>
                                <button
                                    onClick={() => handleBookmark(block)}
                                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition"
                                >
                                    ❤️ Bookmark
                                </button>
                                <button
                                    onClick={() => setPreviewDomainData(block)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                                >
                                    🔍 Preview
                                </button>
                                <button
                                    onClick={() => exportSingleMD(block)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
                                >
                                    Export Markdown
                                </button>
                                <button
                                    onClick={() => checkAvailability(block.name, index)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition"
                                >
                                    🔎 Check Availability
                                </button>
                            </div>

                            {availabilityStatus[index] === "loading" && (
                                <div className="text-yellow-400 text-sm mt-2">⏳ Checking availability...</div>
                            )}
                            {availabilityStatus[index] === "available" && (
                                <div className="text-emerald-400 text-sm mt-2">🟢 Domain is available!</div>
                            )}
                            {availabilityStatus[index] === "taken" && (
                                <div className="text-red-400 text-sm mt-2">🔴 Domain is already taken.</div>
                            )}
                            {availabilityStatus[index] === "error" && (
                                <div className="text-red-500 text-sm mt-2">❌ Error checking availability.</div>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {previewDomainData && (
                <FakeDomainPreview
                    domainData={previewDomainData}
                    onClose={() => setPreviewDomainData(null)}
                />
            )}
        </div>
    );
};

export default DomainAI;