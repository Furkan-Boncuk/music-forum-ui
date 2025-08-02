import React, { useRef } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const mockSongs = [
  { id: 1, title: "Bıraktım Aklımı Balkondan", artist: "Albadeep", plays: "117 B kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 2, title: "Gördüğüme Sevindim", artist: "Gönderdim", plays: "12 Mn kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 3, title: "Ne Ekmek Ne De Su", artist: "Teoman", plays: "1,6 Mn kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 4, title: "Onlar Yanlış Biliyor", artist: "Candan Erçetin", plays: "7,5 Mn kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 5, title: "Gidenlerden", artist: "Mustafa Sandal", plays: "21 Mn kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 6, title: "Küs", artist: "Kelanei ve Layzie", plays: "993 B kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 7, title: "Hata (Live)", artist: "Fatma Turgut", plays: "161 B kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 8, title: "Ateşi Yak", artist: "Ezhel", plays: "5,4 Mn kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 9, title: "Müjdeler Ver", artist: "Bendeniz", plays: "5 Mn kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 10, title: "Hatıra Müzesi", artist: "90 BPM", plays: "656 B kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 11, title: "Aşk Yarası", artist: "Burcu Güneş", plays: "717 B kez dinlendi", albumArt: "https://via.placeholder.com/80" },
  { id: 12, title: "Fırtına", artist: "Farazi & Kodes", plays: "9 Mn kez dinlendi", albumArt: "https://via.placeholder.com/80" },
];

const PopularSongs = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.offsetWidth; // Her bir sayfanın genişliği
      const scrollAmount = direction === "left" ? -scrollWidth : scrollWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box
      bg="#171717"
      color="white"
      p={4}
      pb={0}
      borderRadius="md"
      maxW="600px"
      width={"100%"}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Popüler Şarkılar
        </Text>
        <Flex justifyContent="center" gap={2}>
          <IconButton
            aria-label="Previous"
            icon={<ArrowBackIcon />}
            onClick={() => handleScroll("left")}
            colorScheme="gray"
            size={"sm"}
            borderRadius={"50%"}
          />
          <IconButton
            aria-label="Next"
            icon={<ArrowForwardIcon />}
            onClick={() => handleScroll("right")}
            colorScheme="gray"
            size={"sm"}
            borderRadius={"50%"}
          />
        </Flex>
      </Flex>

      {/* Scrollable Container */}
      <HStack
        ref={scrollRef}
        spacing={4}
        overflowX="auto"
        scrollSnapType="x mandatory"
        css={{
          "&::-webkit-scrollbar": { display: "none" }, // Scrollbar gizleme
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {Array(Math.ceil(mockSongs.length / 4))
          .fill("")
          .map((_, pageIndex) => (
            <VStack
              key={pageIndex}
              spacing={4}
              alignItems="start"
              flexShrink={0}
              w="100%"
              scrollSnapAlign="start"
            >
              {mockSongs
                .slice(pageIndex * 4, pageIndex * 4 + 4)
                .map((song) => (
                  <Flex
                    key={song.id}
                    alignItems="center"
                    bg="#222"
                    p={3}
                    borderRadius="md"
                    w="100%"
                    boxShadow="sm"
                    _hover={{ bg: "#333" }}
                  >
                    <Image
                      src={song.albumArt}
                      alt={song.title}
                      boxSize="60px"
                      borderRadius="md"
                      mr={4}
                    />
                    <Box>
                      <Text fontWeight="bold" noOfLines={1}>
                        {song.title}
                      </Text>
                      <Text fontSize="sm" color="gray.400" noOfLines={1}>
                        {song.artist}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {song.plays}
                      </Text>
                    </Box>
                  </Flex>
                ))}
            </VStack>
          ))}
      </HStack>
    </Box>
  );
};

export default PopularSongs;
