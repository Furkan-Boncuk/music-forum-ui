import { api } from "../api";

export const getLyrics = async (songTitle: string, artistName: string) => {
  const response = await api.get("/songs/lyrics", {
    params: { songTitle, artistName },
  });
  return response.data.lyrics;
};
