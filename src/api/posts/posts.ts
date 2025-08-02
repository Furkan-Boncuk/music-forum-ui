import axios from "axios";
import { api } from "../api";

export const getPosts = async ({
  page,
  limit = 10,
}: {
  page: number;
  limit: number;
}) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
};

export const createPost = async ({
  song,
  title,
  content,
  token,
}: {
  song: {
    title: string;
    artist: string;
    albumArt: string;
    referenceId: string;
  };
  title: string;
  content: string;
  token: string;
}) => {
  const response = await api.post(
    "/posts",
    { song, title, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getPostById = async ({
  postId,
  token,
}: {
  postId: string;
  token: string;
}) => {
  const response = await api.get(`/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPostsBySong = async (songId: string) => {
  const response = await axios.get(`/posts/${songId}`);
  return response.data;
};

export const deletePost = async (id: string, token: string) => {
  const response = await axios.delete(`/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const toggleLikePost = async ({
  postId,
  token,
}: {
  postId: string;
  token: string;
}) => {
  const response = await api.post(`/posts/${postId}/like`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const toggleBookmarkPost = async ({
  postId,
  token,
}: {
  postId: string;
  token: string;
}) => {
  const response = await api.post(`/posts/${postId}/bookmark`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const sharePost = async ({
  postId,
  token,
}: {
  postId: string;
  token: string;
}) => {
  const response = await api.post(`/posts/${postId}/share`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
