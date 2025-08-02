import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  IconButton,
  Flex,
  Badge,
  Button,
} from "@chakra-ui/react";
import { IoVolumeHigh } from "react-icons/io5";
import { IoMdVolumeOff } from "react-icons/io";
import axios from "axios";
import { redirectToSpotifyLogin } from "../../api/spotifyAuth";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

const SpotifyMiniPlayer = ({
  trackUri,
  songTitle,
  artistName,
  albumArt,
}: {
  trackUri: string;
  songTitle: string;
  artistName: string;
  albumArt: string;
}) => {
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const refreshToken = localStorage.getItem("spotifyRefreshToken");
  // const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // Kullanıcı tıklayana kadar şarkıyı oynatma
  const [currentToken, setCurrentToken] = useState(accessToken);

  useEffect(() => {
    if (!currentToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const playerInstance = new window.Spotify.Player({
          name: "Custom Spotify Mini Player",
          getOAuthToken: (cb: (token: string) => void) => cb(currentToken),
          volume: isMuted ? 0 : 0.5,
          enableP2P: false, // Güvenli olmayan bağlantıları engelle.
        });

        playerInstance.addListener("ready", async ({ device_id }: { device_id: string }) => {
          console.log("✅ Spotify Player Hazır! Device ID:", device_id);
          setDeviceId(device_id);
          localStorage.setItem("spotifyDeviceId", device_id);
          await playerInstance.activateElement();
        });

        playerInstance.addListener("initialization_error", ({ message }: { message: string }) =>
          console.error("init error", message)
        );
        playerInstance.addListener("authentication_error", ({ message }: { message: string }) =>
          console.error("auth error", message)
        );
        playerInstance.addListener("account_error", ({ message }: { message: string }) =>
          console.error("account error", message)
        );
        playerInstance.addListener("playback_error", ({ message }: { message: string }) =>
          console.error("playback error", message)
        );        

        // playerInstance.addListener("player_state_changed", (state) => {
        //   if (!state) return;
        //   setIsPlaying(!state.paused);
        // });

        playerInstance.connect();
        // setPlayer(playerInstance);
      };
    };
  }, [currentToken]);

  useEffect(() => {
    const savedDeviceId = localStorage.getItem("spotifyDeviceId");
    if (savedDeviceId) {
      console.log("🔄 `deviceId` `localStorage`'tan yüklendi:", savedDeviceId);
      setDeviceId(savedDeviceId);
    }
  }, []);

  const playSong = async () => {
    if (!deviceId || !trackUri || !currentToken) {
      console.warn("❌ `deviceId` veya `accessToken` eksik!");
      return;
    }

    console.log("🎵 `playSong()` başladı. `deviceId`:", deviceId);
    setIsClicked(true); // Kullanıcının tıkladığını kaydet

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [trackUri] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (res.status === 401) {
        console.log("⚠️ Access token süresi doldu, yenileniyor...");
        const newToken = await refreshSpotifyAccessToken();
        if (newToken) {
          setCurrentToken(newToken);
          playSong();
        }
      }
    } catch (error) {
      console.error("Şarkı oynatılırken hata:", error);
    }
  };

  // **Token Refresh Mantığını Güncelle**
  const refreshSpotifyAccessToken = async () => {
    if (!refreshToken) {
      console.warn("❌ Refresh token bulunamadı! Kullanıcı yeniden giriş yapmalı.");
      return null;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/spotify/refresh`,
        { refreshToken }
      );

      const { accessToken, expiresIn } = response.data;

      localStorage.setItem("spotifyAccessToken", accessToken);
      localStorage.setItem(
        "spotifyTokenExpiration",
        (Date.now() + expiresIn * 1000).toString()
      );

      console.log("✅ Yeni Access Token alındı:", accessToken);
      setCurrentToken(accessToken);

      return accessToken;
    } catch (error) {
      console.error("Spotify token yenileme hatası:", error);
      return null;
    }
  };

  return (
    <Flex align="center" position="relative">
      <Flex
        bg="#171717"
        color="white"
        p={3}
        borderRadius="md"
        boxShadow="lg"
        align="center"
        justify="space-between"
        cursor={accessToken ? "pointer" : "not-allowed"}
        opacity={accessToken ? 1 : 0.8}
        _hover={accessToken ? { bg: "#212121" } : {}}
        pointerEvents={accessToken ? "all" : "none"}
        onClick={accessToken ? playSong : () => {}}
        w="100%">
        <Image
          src={albumArt}
          boxSize="50px"
          borderRadius="md"
          alt={songTitle}
        />
        <Box ml={3} flex="1">
          <Text fontWeight="bold" fontSize="md" noOfLines={1}>
            {songTitle}
          </Text>
          <Text fontSize="sm" color="gray.400" noOfLines={1}>
            {artistName}
          </Text>
        </Box>
        <Badge colorScheme={"gray"} p={0} borderRadius="full">
          <IconButton
            aria-label="Ses Aç/Kapat"
            icon={
              isMuted || !isClicked ? (
                <IoMdVolumeOff size={18} />
              ) : (
                <IoVolumeHigh size={18} />
              )
            }
            size="sm"
            variant="ghost"
            color="white"
            borderRadius="full"
            onClick={() => {
              if (!isClicked) {
                playSong();
              }
              setIsMuted(!isMuted);
            }}
          />
        </Badge>
      </Flex>

      {!accessToken && (
        <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          align="center"
          justify="center"
          bg="rgba(0, 0, 0, 0.4)"
          borderRadius="md">
          <Button colorScheme="green" onClick={redirectToSpotifyLogin}>
            🎵 Spotify ile Dinle
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default SpotifyMiniPlayer;
