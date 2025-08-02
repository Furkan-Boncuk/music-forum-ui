import { api } from "../api";

export const fetchUserProfile = async (userId: string) => {
  const response = await api.get(`/profile/${userId}`);
  return response.data;
};

export const fetchUserPosts = async (userId: string) => {
  const response = await api.get(`/profile/${userId}/posts`);
  return response.data;
};

export const fetchUserLikedPosts = async (userId: string) => {
  const response = await api.get(`/profile/${userId}/liked`);
  return response.data;
};

export const fetchUserRecentSongs = async (userId: string) => {
  const response = await api.get(`/profile/${userId}/recent-songs`);
  return response.data;
};

export const toggleFollowUser = async (userId: string, token: string) => {
  const response = await api.post(
    `/profile/${userId}/follow`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
