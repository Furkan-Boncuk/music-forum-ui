import { useState } from "react";
import {
  Box,
  Input,
  Button,
  Heading,
  useToast,
  Flex,
  List,
  ListItem,
  Text,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts/posts";
import { searchSongs } from "../api/songs/songs";
import SpotifyMiniPlayer from "../buss-components/songDetails/SpotifyPlayer";
import TiptapEditor from "../buss-components/write/TiptapEditor";
import { useAuthStore } from "../stores/authStore";

const WritePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  const handleSearch = async () => {
    if (!searchQuery) {
      setSelectedSong(null);
      return;
    }
    try {
      const results = await searchSongs(searchQuery);
      setSongs(results.songs);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Şarkılar bulunamadı.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setSearchQuery(song.title);
    setSongs([]);
  };

  const handleSubmit = async () => {
    if (!token || !user) {
      toast({
        title: "Hata",
        description: "Gönderi paylaşmak için oturum açmalısınız.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (!selectedSong || !title || content.length < 10) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm alanları doldurun ve en az 10 karakter girin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {        
      await createPost({
        song: {
          title: selectedSong.title,
          artist: selectedSong.artist,
          albumArt: selectedSong.albumArt || "",
          referenceId: selectedSong.referenceId,
        },
        title,
        content,
        token: token as string,
      });

      toast({
        title: "Başarı!",
        description: "Yazınız eklendi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yazı eklenirken hata oluştu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Flex direction={"column"} p={5} maxW="600px" mx="auto">
      <Heading textAlign={"center"} mb={4}>
        {selectedSong ? "" : "🎵 Şarkı Hakkında Yaz"}
      </Heading>
      <Flex mb={3} position="relative">
        <Input
          autoFocus
          type="search"
          placeholder="Şarkı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}  
        />
        {songs.length > 0 && (
          <List
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="#171717"
            p={2}
            borderRadius="md"
            mt={1}
            zIndex={10}
            maxH="200px"
            overflowY="auto"
            border={"1px solid #444"}>
            {songs.map((song) => (
              <ListItem
                key={song._id}
                cursor="pointer"
                onClick={() => handleSelectSong(song)}>
                <Flex
                  bg="transparent"
                  p={1}
                  borderRadius="md"
                  w="100%"
                  alignItems="center"
                  cursor={"pointer"}
                  _hover={{ bg: "#424242" }}>
                  <Image
                    src={song.albumArt || "/assets/song_placeholder_image.png"}
                    alt={song.title}
                    boxSize="45px"
                    borderRadius="md"
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize={"md"} noOfLines={1}>
                      {song.title}
                    </Text>
                    <Text fontSize="sm" color="gray.300" noOfLines={1}>
                      {song.artist}
                    </Text>
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
      </Flex>
      {selectedSong && (
        <Box mb={3}>
          <SpotifyMiniPlayer
            trackUri={`spotify:track:${selectedSong.referenceId}`}
            songTitle={selectedSong.title}
            artistName={selectedSong.artist}
            albumArt={selectedSong.albumArt}
          />
        </Box>
      )}
      <Input
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={3}
      />
      <TiptapEditor content={content} setContent={setContent} />
      <Button
        alignSelf={"end"}
        colorScheme="gray"
        mt={3}
        onClick={handleSubmit}
        isDisabled={!selectedSong || !title || content.length < 10}>
        Yayınla
      </Button>
    </Flex>
  );
};

export default WritePage;
