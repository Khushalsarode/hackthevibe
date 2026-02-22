import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Rocket, 
  Search, 
  Loader2, 
  ArrowLeft 
} from "lucide-react";

const UserBookmarks = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 🔹 Memoized Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!user?.sub) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/bookmarks/${user.sub}`);
      setBookmarks(res.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.sub]);

  useEffect(() => {
    if (isAuthenticated) fetchBookmarks();
  }, [isAuthenticated, fetchBookmarks]);

  // 🔹 Delete bookmark
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this project?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const openWorkspace = (bookmark) => {
    navigate("/workspace", { state: { data: bookmark } });
  };

  // Filter bookmarks based on search
  const filteredBookmarks = bookmarks.filter(b => 
    b.domainName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-slate-400 font-medium tracking-wide">Retrieving your saved vibes...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <Bookmark className="mx-auto text-slate-700" size={48} />
          <h2 className="text-xl font-bold">Access Restricted</h2>
          <p className="text-slate-400">Please login to view your saved launch kits.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-indigo-600 rounded-xl font-bold text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
              <Bookmark className="text-indigo-500" /> My Saved Projects
            </h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 w-full md:w-80 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Grid Layout */}
        {filteredBookmarks.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500 italic">No projects found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="group bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white truncate w-full">
                      {bookmark.domainName}
                    </h3>
                  </div>

                  {bookmark.tagline && (
                    <p className="text-sm text-slate-400 line-clamp-2 italic">
                      "{bookmark.tagline}"
                    </p>
                  )}

                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">SEO Preview</p>
                    <p className="text-xs text-slate-300 truncate font-medium">{bookmark.metaTitle}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => openWorkspace(bookmark)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-500/20 active:scale-95 text-white"
                  >
                    <Rocket size={14} /> Open
                  </button>

                  <button
                    onClick={() => handleDelete(bookmark._id)}
                    className="p-2.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded-xl transition active:scale-95"
                    title="Delete Bookmark"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookmarks;