import { api } from "../api"; // Axios instance'ını içe aktar

export const findUserById = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("Kullanıcı alınırken hata:", error);
    throw error.response?.data?.message || "Kullanıcı bulunamadı.";
  }
};
