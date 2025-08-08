import { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  Image,
  Flex,
  Spinner,
  Center,
  Button,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { ISong } from "../types/ISong.interface";
import { getSongById } from "../api/songs/songs";
import { useExtractColors } from "react-extract-colors";
import "./../styles/global.css";
import { redirectToSpotifyLogin } from "../api/spotifyAuth";
import axios from "axios";
import {
  createSongMap,
  getSongMapById,
  getSongMapBySongId,
} from "../api/songMap/songMap";
import { useAuthStore } from "../stores/authStore";
import { IoMdVolumeOff } from "react-icons/io";
import { IoVolumeHigh } from "react-icons/io5";

const SongMapPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const { token } = useAuthStore();

  const [song, setSong] = useState<ISong | null>(null);
  const [playerState, setPlayerState] = useState<any>(null);
  const playerRef = useRef<any>(null);
  const [hasClicked, setHasClicked] = useState(false);

  // Progress tracking için daha hassas yaklaşım
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const accessToken = localStorage.getItem("spotifyAccessToken");
  const refreshToken = localStorage.getItem("spotifyRefreshToken");
  const spotifyDeviceId = localStorage.getItem("spotifyDeviceId");
  const [deviceId, setDeviceId] = useState<string | null>(spotifyDeviceId);
  const [isMuted, setIsMuted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [currentToken, setCurrentToken] = useState(accessToken);
  const [hasRetried, setHasRetried] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trackUri, setTrackUri] = useState<string | null>(null);

  // SONG MAP FEATURE
  const [songMap, setSongMap] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLyric, setCurrentLyric] = useState<string | null>(null);
  const [nextLyric, setNextLyric] = useState<string | null>(null);

  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const { dominantColor, darkerColor } = useExtractColors(song?.albumArt ?? "");
  const bg =
    dominantColor && darkerColor
      ? `radial-gradient(circle at center, ${dominantColor}, ${darkerColor})`
      : "#111";

  // İyileştirilmiş progress tracking
  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;

    // Progress'i daha sık güncelle (1000ms - daha stabil)
    const interval = setInterval(async () => {
      try {
        const state = await playerRef.current.getCurrentState();

        if (state) {
          console.log("🎵 Player State:", state);
          console.log("🎵 Track Window:", state.track_window);
          console.log("🎵 Is Playing:", state.is_playing);
          console.log("🎵 Position:", state.position);
          console.log("🎵 Duration:", state.duration);

          setPlayerState(state);
          setIsPlaying(!state.paused); // paused yerine is_playing kullan

          // Progress'i position'dan al (position milisaniye cinsinden)
          const currentProgress = state.position || 0;
          setProgress(currentProgress);

          console.log("📊 Current Progress (ms):", currentProgress);
          console.log(
            "📊 Current Progress (sec):",
            Math.floor(currentProgress / 1000)
          );

          lastUpdateTimeRef.current = Date.now();
        } else {
          console.warn("⚠️ Player state null");

          // State null ise manuel kontrol et
          try {
            await playerRef.current.resume();
            console.log("🔄 Player resume denendi");
          } catch (resumeErr) {
            console.warn("Resume error:", resumeErr);
          }
        }
      } catch (err) {
        console.warn("getCurrentState error:", err);
      }
    }, 1000); // 1 saniyede bir daha stabil

    return () => clearInterval(interval);
  }, [isPlayerReady]);

  // Şarkı çalarken progress'i gerçek zamanlı güncelle
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Şarkı çalıyorsa ve progress varsa gerçek zamanlı güncelleme
    if (isPlaying && progress >= 0) {
      console.log("⏰ Starting real-time progress tracking");
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 500; // 500ms artış
          return newProgress;
        });
      }, 500); // 500ms'de bir güncelle
    } else {
      console.log(
        "⏸️ Stopping real-time progress tracking - isPlaying:",
        isPlaying,
        "progress:",
        progress
      );
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // SongMap verisini debug et
  useEffect(() => {
    if (songMap?.lyrics) {
      console.log("🔍 FULL SONGMAP DEBUG:");
      console.log("songMap:", songMap);
      console.log("First lyric object:", songMap.lyrics[0]);
      console.log(
        "Available properties:",
        Object.keys(songMap.lyrics[0] || {})
      );

      // Timing field'ını bul
      const sampleLyric = songMap.lyrics[0];
      if (sampleLyric) {
        console.log("🔍 Possible timing fields:");
        Object.keys(sampleLyric).forEach((key) => {
          console.log(`${key}:`, sampleLyric[key]);
        });
      }
    }
  }, [songMap]);

  // Lyric senkronizasyonu - offset ile düzeltilmiş
  useEffect(() => {
    if (!songMap?.lyrics || songMap.lyrics.length === 0 || progress === 0) {
      // Progress 0 ise ilk lyric'i göster
      if (progress === 0 && songMap?.lyrics?.length > 0) {
        const firstLyric = songMap.lyrics[0];
        if (currentLyric !== firstLyric?.text) {
          setCurrentLyric(firstLyric?.text || null);
        }
        if (nextLyric !== songMap.lyrics[1]?.text) {
          setNextLyric(songMap.lyrics[1]?.text || null);
        }
      }
      return;
    }

    const lyrics = songMap.lyrics;

    // Farklı timing field'larını dene
    const getTimingValue = (lyric: any) => {
      return (
        lyric.startTimeMs ||
        lyric.startTime ||
        lyric.start_time_ms ||
        lyric.timestamp ||
        lyric.time ||
        0
      );
    };

    // Basit index-based matching (eğer timing yok ise)
    const hasValidTiming = lyrics.some(
      (lyric: string) => getTimingValue(lyric) > 0
    );

    if (!hasValidTiming) {
      console.log("⚠️ No valid timing found, using progress-based estimation");
      // Timing yoksa, progress'e göre tahmin et
      const totalDuration = playerState?.duration_ms || 194720;
      const progressPercentage = Math.max(0, progress) / totalDuration;
      const estimatedIndex = Math.floor(progressPercentage * lyrics.length);
      const currentIndex = Math.min(
        Math.max(0, estimatedIndex),
        lyrics.length - 1
      );

      const current = lyrics[currentIndex];
      const next = lyrics[currentIndex + 1];

      console.log(
        `📊 Estimated index: ${currentIndex} (${progressPercentage.toFixed(
          2
        )}%) - "${current?.text}"`
      );

      if (currentLyric !== current?.text) {
        setCurrentLyric(current?.text || null);
      }
      if (nextLyric !== next?.text) {
        setNextLyric(next?.text || null);
      }
      return;
    }

    // Normal timing-based matching with offset
    const currentIndex = lyrics.findLastIndex(
      (segment: any) => progress >= getTimingValue(segment)
    );

    if (currentIndex >= 0) {
      const current = lyrics[currentIndex];
      const next = lyrics[currentIndex + 1];

      console.log(
        `🎵 Found lyric at index ${currentIndex}: "${current?.text}"`
      );

      if (currentLyric !== current?.text) {
        setCurrentLyric(current?.text || null);
        console.log("✅ Lyric updated to:", current?.text);
      }

      if (nextLyric !== next?.text) {
        setNextLyric(next?.text || null);
      }
    }
  }, [progress, songMap?.lyrics, playerState?.duration_ms]);

  // Şarkı ve SongMap yükleme
  useEffect(() => {
    const fetchSongDetailsAndMap = async () => {
      try {
        setLoading(true);
        const fetchedSong = await getSongById(songId as string);
        setSong(fetchedSong);
        setTrackUri(`spotify:track:${fetchedSong.referenceId}`);

        try {
          const existingMap = await getSongMapBySongId(fetchedSong._id);
          setSongMap(existingMap);
          setIsGenerating(false);
        } catch {
          console.log("❌ Mevcut songMap bulunamadı.");
        }
      } catch (error) {
        console.error("Şarkı detaylarını alırken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetailsAndMap();
  }, [songId]);

  // Spotify Player kurulumu
  useEffect(() => {
    if (!currentToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: "Custom Spotify Mini Player",
        getOAuthToken: (cb: (token: string) => void) => cb(currentToken),
        volume: isMuted ? 0 : 0.5,
      });

      playerInstance.addListener(
        "ready",
        async ({ device_id }: { device_id: string }) => {
          console.log("✅ Spotify Player Hazır! Device ID:", device_id);
          setDeviceId(device_id);
          setIsPlayerReady(true);
          localStorage.setItem("spotifyDeviceId", device_id);
          try {
            await playerInstance.activateElement();
          } catch (e) {
            console.warn("🔒 activateElement() çağrısı başarısız oldu:", e);
          }
        }
      );

      // Player state değişikliklerini dinle - daha kapsamlı
      playerInstance.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState) => {
          console.log("🎵 Player state changed event:", state);
          if (state) {
            setPlayerState(state);
            setIsPlaying(!state.paused); // paused yerine is_playing

            // Progress'i güncelle
            const currentProgress = state.position || 0;
            setProgress(currentProgress);

            console.log("📊 State changed - Progress:", currentProgress, "ms");
            console.log("📊 State changed - Playing:", !state.paused);
            console.log(
              "📊 State changed - Track:",
              state.track_window?.current_track?.name
            );

            lastUpdateTimeRef.current = Date.now();
          } else {
            console.log("⚠️ Player state changed to null");
          }
        }
      );

      // Ek event listener'lar
      playerInstance.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("🎵 Player ready event - Device ID:", device_id);
        }
      );

      playerInstance.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("⚠️ Player not ready - Device ID:", device_id);
        }
      );

      playerRef.current = playerInstance;

      playerInstance.addListener(
        "initialization_error",
        ({ message }: { message: string }) =>
          console.error("init error", message)
      );
      playerInstance.addListener(
        "authentication_error",
        ({ message }: { message: string }) =>
          console.error("auth error", message)
      );
      playerInstance.addListener(
        "account_error",
        ({ message }: { message: string }) =>
          console.error("account error", message)
      );
      playerInstance.addListener(
        "playback_error",
        ({ message }: { message: string }) =>
          console.error("playback error", message)
      );

      playerInstance.connect();
    };

    return () => {
      // Cleanup
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentToken, isMuted]);

  const refreshSpotifyAccessToken = async (onSuccess?: () => void) => {
    if (!refreshToken) {
      console.warn(
        "❌ Refresh token bulunamadı! Kullanıcı yeniden giriş yapmalı."
      );
      redirectToSpotifyLogin();
      return null;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/spotify/refresh`,
        { refreshToken }
      );

      const { accessToken: newAccessToken, expiresIn } = response.data;
      localStorage.setItem("spotifyAccessToken", newAccessToken);
      localStorage.setItem(
        "spotifyTokenExpiration",
        (Date.now() + expiresIn * 1000).toString()
      );

      setCurrentToken(newAccessToken);
      if (onSuccess) onSuccess();
      return newAccessToken;
    } catch (error) {
      console.error("Spotify token yenileme hatası:", error);
      return null;
    }
  };

  const playSong = async () => {
    console.log("🎵 Playing song - DeviceId:", deviceId, "TrackUri:", trackUri);
    setHasClicked(true);
    setIsClicked(true);

    console.log("play song", deviceId, trackUri, currentToken);

    if (!deviceId || !trackUri || !currentToken) {
      console.warn("❌ `deviceId` veya `accessToken` eksik!");
      return;
    }

    try {
      // 1. Önce player'ı aktifleştir
      if (playerRef.current) {
        try {
          await playerRef.current.activateElement();
          console.log("✅ Player activated");
        } catch (activateErr) {
          console.warn("⚠️ Player activation error:", activateErr);
        }
      }

      // 2. Cihazı aktif hale getir
      const transferRes = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: false,
        }),
      });

      console.log("🔄 Device transfer response:", transferRes.status);

      // 3. Kısa bekleme
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 4. Şarkıyı çal
      const playRes = await fetch(
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

      console.log("▶️ Play response:", playRes.status);

      if (playRes.status === 401 && !hasRetried) {
        console.log("⚠️ Access token süresi doldu, yenileniyor...");
        setHasRetried(true);
        await refreshSpotifyAccessToken(() => playSong());
      } else if (playRes.status === 404) {
        console.log("🔄 Device bulunamadı, yeniden aktifleştiriliyor...");
        setTimeout(() => playSong(), 2000);
      } else if (!playRes.ok) {
        const errorText = await playRes.text();
        console.error("❌ Play error:", playRes.status, errorText);
      } else {
        console.log("✅ Şarkı başarıyla çalınıyor!");

        // 5. Manuel olarak state'i güncelle
        setTimeout(async () => {
          try {
            const currentState = await playerRef.current?.getCurrentState();
            if (currentState) {
              console.log("🔄 Manual state refresh:", currentState);
              setPlayerState(currentState);
              setIsPlaying(!currentState.paused);
              setProgress(currentState.position || 0);
            }
          } catch (stateErr) {
            console.warn("Manual state refresh error:", stateErr);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Şarkı oynatılırken hata:", error);
    }
  };

  const generateSongMap = async () => {
    if (!song?._id) return;

    setIsGenerating(true);
    setError(null);

    try {
      const newSongMap = await createSongMap(song._id, token as string);
      pollSongMap(newSongMap._id);
    } catch (err: any) {
      setError(err.message || "Failed to create song map");
      setIsGenerating(false);
    }
  };

  const pollSongMap = (songMapId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await getSongMapById(songMapId);
        if (data?.lyrics) {
          clearInterval(interval);
          setSongMap(data);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);
  };

  if (!song || loading) {
    return (
      <Center h="100vh">
        <Spinner color="green.300" />
      </Center>
    );
  }

  return (
    <Box minH={"100vh"} width={"100%"} height={"100%"} bg={bg} alignContent={"center"} color="white" p={5}>
      {songMap && (
        <Box
          position="fixed"
          top="20%"
          left="50%"
          transform="translateX(-50%)"
          zIndex={10}
          textAlign="center"
          width="90%"
          maxWidth="600px"
        >
          {currentLyric && (
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              px={4}
              py={2}
              bg="rgba(0,0,0,0.3)"
              borderRadius="md"
              mb={2}
              backdropFilter="blur(10px)"
              transition="all 0.3s ease">
              {currentLyric}
            </Text>
          )}
          {nextLyric && (
            <Text
              fontSize="md"
              color="rgba(255,255,255,0.6)"
              px={3}
              py={1}
              transition="all 0.3s ease"
              fontStyle="italic">
              {nextLyric}
            </Text>
          )}
        </Box>
      )}

      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="100%"
        mt={songMap ? "200px" : "0"}
      >
        <Box
          border={isClicked ? "2px solid" : "none"}
          borderColor={"transparent"}
          transition={"border 0.3s ease"}
          onClick={playSong}
          cursor="pointer"
          boxSize="125px"
          borderRadius="full"
          overflow="hidden"
          mb={4}
          className={hasClicked ? "rotating" : ""}
          boxShadow="0 0 125px rgba(255,255,255,0.1)"
          position="relative"
        >
          <Image src={song.albumArt} alt={song.title} boxSize="100%" />

          {!accessToken && (
            <Flex
              boxSize={"100%"}
              position="absolute"
              top="0"
              left="0"
              alignItems="center"
              justifyContent="center"
              bg="rgba(0, 0, 0, 0.4)"
              borderRadius="full">
              <Button
                variant={"solid"}
                colorScheme="green"
                onClick={redirectToSpotifyLogin}
                size="sm">
                🎵 Spotify
              </Button>
            </Flex>
          )}

          {accessToken && !songMap && !isGenerating && (
            <Flex
              boxSize={"100%"}
              position="absolute"
              top="0"
              left="0"
              alignItems="center"
              justifyContent="center"
              bg="rgba(0, 0, 0, 0.4)"
              borderRadius="full"
            >
              <Button onClick={generateSongMap} colorScheme="teal" size="sm">
                Harita
              </Button>
            </Flex>
          )}

            <Badge position={"absolute"} top={"10px"} right={"20px"} colorScheme="gray" p={0} borderRadius="full">
              <IconButton
                aria-label="Ses Aç/Kapat"
                icon={
                  isMuted ? (
                    <IoMdVolumeOff size={18} />
                  ) : (
                    <IoVolumeHigh size={18} />
                  )
                }
                size="sm"
                variant="ghost"
                color="white"
                borderRadius="full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => {
                    const newMuted = !prev;
                    if (playerRef.current) {
                      playerRef.current.setVolume(newMuted ? 0 : 0.5);
                    }
                    return newMuted;
                  });
                }}
              />
            </Badge>
        </Box>

        <Text fontSize="md" fontWeight="bold">
          {song.title}
        </Text>
        <Text fontSize="sm" color="gray.400">
          {song.artist}
        </Text>

        {playerState && (
          <Box mt={2} textAlign="center">
            <Text fontSize="sm">
              {Math.floor((progress || 0) / 1000)}s /{" "}
              {Math.floor(playerState.duration_ms / 1000)}s
            </Text>

            <Box
              width="200px"
              height="2px"
              bg="rgba(255,255,255,0.3)"
              mt={2}
              borderRadius="full">
              <Box
                height="100%"
                bg="white"
                borderRadius="full"
                width={`${((progress || 0) / playerState.duration_ms) * 100}%`}
                transition="width 0.1s ease"
              />
            </Box>

            <Text fontSize="xs" color="rgba(255,255,255,0.5)" mt={1}>
              Progress: {progress || 0}ms | Playing: {isPlaying ? "Yes" : "No"}
            </Text>
          </Box>
        )}

        {isGenerating && (
          <Text mt={4} fontStyle="italic" textAlign="center">
            Generating song map... This may take a minute.
          </Text>
        )}

        {error && (
          <Text mt={4} color="red.400" textAlign="center">
            {error}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default SongMapPage;
