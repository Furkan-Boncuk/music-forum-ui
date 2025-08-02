import { api } from "../api";

// Şarkı arama işlemi
export const searchSongs = async (query: string) => {
  if (!query.trim()) throw new Error("Arama sorgusu boş olamaz.");

  const response = await api.get("/songs/search", {
    params: { query },
  });

  // const response = await fetch(`https://music-forum-be.onrender.com/api/songs/search?query=${query}`, {
  //   method: "GET",
  //   credentials: "include", // 🎯 CORS için kimlik doğrulama gönderiyorsa ekle
  // })


  return response.data; // Örn: { source: "database" | "spotify", songs: [...] }
};

export const getSongById = async (id: string) => {
  const response = await api.get(`/songs/${id}`);
  return response.data.song;
};