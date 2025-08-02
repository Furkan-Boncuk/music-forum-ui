import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSpotifyAccessToken, handleSpotifyCallback } from "../../api/spotifyAuth";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processSpotifyCallback = async () => {
      await handleSpotifyCallback();

      const accessToken = getSpotifyAccessToken();
      if (accessToken) {
        localStorage.setItem("spotifyAccessToken", accessToken);
        console.log("🎵 Spotify Access Token alındı:", accessToken);
      }

      const lastPage = localStorage.getItem("lastVisitedPage") || "/";
      localStorage.removeItem("lastVisitedPage");

      navigate(lastPage, { replace: true });
    };

    processSpotifyCallback();
  }, [navigate]);

  return null;
};

export default SpotifyCallback;