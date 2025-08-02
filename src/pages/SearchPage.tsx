import React, { useState } from "react";
import {
  Input,
  Box,
  VStack,
  Text,
  Spinner,
  useToast,
  Image,
  Flex,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için import
import { searchSongs } from "../api/songs/songs";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // Yönlendirme için hook

  const handleSearch = async () => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchSongs(query);
      setSongs(data.songs); // Şarkıları state'e kaydet
    } catch (error: any) {
      console.error("Şarkı arama hatası:", error);
      toast({
        title: "Hata",
        description: error.response?.data?.message || "Bir hata meydana geldi",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box
      bg="#171717"
      color="white"
      p={4}
      borderRadius="md"
      mx={"auto"}
      maxW="600px"
      width={"100%"}
      height={"100vh"}>
      <Input
        autoFocus
        type="search"
        placeholder="Şarkı ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        mb={4}
      />

      {loading && (
        <Center height={"100vh"}>
          <Spinner size="xl" />
        </Center>
      )}

      <Box overflowY={"auto"} pb={"4rem"}>
        <VStack spacing={2} mt={4}>
          {songs.map((song: any) => (
            <Flex
              key={song.referenceId || song._id}
              bg="#171717"
              p={1}
              borderRadius="md"
              w="100%"
              alignItems="center"
              cursor={"pointer"}
              _hover={{ bg: "#424242" }}
              onClick={() =>
                navigate(`/songs/${song.referenceId || song._id}`)
              }>
              <Image
                src={song.albumArt || "/assets/song_placeholder_image.png"}
                alt={song.title}
                boxSize="60px"
                borderRadius="md"
                mr={4}
              />
              <Box>
                <Text fontWeight="bold" noOfLines={1}>
                  {song.title}
                </Text>
                <Text fontSize="sm" color="gray.300" noOfLines={1}>
                  {song.artist}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default SearchPage;
