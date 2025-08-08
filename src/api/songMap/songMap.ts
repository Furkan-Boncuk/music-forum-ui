import { api } from "../api";

export const createSongMap = async (songId: string, token: string) => {
  const response = await api.post("/song-maps", { songId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSongMapById = async (songMapId: string) => {
  const response = await api.get(`/song-maps/${songMapId}`);
  return response.data;
};

export const getSongMapBySongId = async (songId: string) => {
  const res = await api.get(`/song-maps/by-song/${songId}`);
  return res.data;
};
