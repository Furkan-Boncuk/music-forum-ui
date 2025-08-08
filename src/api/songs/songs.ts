import { api } from "../api";

export const searchSongs = async (query: string) => {
  if (!query.trim()) throw new Error("Arama sorgusu boş olamaz.");

  const response = await api.get("/songs/search", {
    params: { query },
  });
  return response.data;
};

export const getSongById = async (id: string) => {
  const response = await api.get(`/songs/${id}`);
  return response.data.song;
};