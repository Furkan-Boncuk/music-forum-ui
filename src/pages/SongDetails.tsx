import { useState, useEffect } from "react";
import { Box, Text, VStack, Flex, Spinner, Divider } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getSongById } from "../api/songs/songs";
import SongLyrics from "../buss-components/feed/SongLyrics";
import OnlineUsersOnTheSong from "../buss-components/songDetails/OnlineUsersOnTheSong";
import SpotifyMiniPlayer from "../buss-components/songDetails/SpotifyPlayer";

const SongDetailsPage = () => {
  const { songId } = useParams();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        setLoading(true);
        const fetchedSong = await getSongById(songId as string);
        setSong(fetchedSong);
      } catch (error) {
        console.error("Şarkı detaylarını alırken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [songId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!song) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="lg" color="red.500">
          Şarkı bulunamadı.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4} maxW="800px" mx="auto" mb={"5rem"}>
      <Flex direction={"column"} gap={"1rem"}>
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        gap="1">
        <Box flex="5">
          <SpotifyMiniPlayer
            trackUri={`spotify:track:${song.referenceId}`}
            songTitle={song.title}
            artistName={song.artist}
            albumArt={song.albumArt}
          />
        </Box>
        <Box flex="1">
          <OnlineUsersOnTheSong songId={songId!} />
        </Box>
      </Flex>

      <SongLyrics songTitle={song.title} artistName={song.artist} />

      </Flex>
    </Box>
  );
};

export default SongDetailsPage;
