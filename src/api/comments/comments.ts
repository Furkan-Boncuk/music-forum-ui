import { api } from "../api";

export const getComments = async (postId: string) => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

export const addComment = async (postId: string, content: string, token: string) => {
  const response = await api.post(
    "/comments",
    { postId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
