import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const UserBookmarks = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch bookmarks
  const fetchBookmarks = async () => {
    if (!user?.sub) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookmarks/${user.sub}`
      );
      setBookmarks(res.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  // 🔹 Delete bookmark
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  const openWorkspace = (bookmark) => {
  // Pass the full record to the new Workspace component
  navigate("/workspace", { state: { data: bookmark } });
};

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading bookmarks...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Please login to view bookmarks.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl">

        <h1 className="text-3xl font-bold mb-8 text-center">
          ❤️ Your Saved Domains
        </h1>

        {bookmarks.length === 0 ? (
          <p className="text-center text-slate-400">
            No bookmarks yet.
          </p>
        ) : (
          <div className="space-y-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-indigo-500 transition"
              >
                <h3 className="text-xl font-semibold text-indigo-400 mb-2">
                  {bookmark.domainName}
                </h3>

                {bookmark.tagline && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Tagline:</span>{" "}
                    {bookmark.tagline}
                  </p>
                )}

                {bookmark.metaTitle && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">SEO Title:</span>{" "}
                    {bookmark.metaTitle}
                  </p>
                )}

                {bookmark.metaDesc && (
                  <p className="text-sm mb-4">
                    <span className="font-medium">SEO Description:</span>{" "}
                    {bookmark.metaDesc}
                  </p>
                )}

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => openWorkspace(bookmark)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                  >
                    🚀 Open Workspace
                  </button>

                  <button
                    onClick={() => handleDelete(bookmark._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
                  >
                    🗑 Delete
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