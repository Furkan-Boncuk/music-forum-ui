import { useEffect, useState } from "react";
import { Box, Text, Spinner, Flex } from "@chakra-ui/react";
import { getLyrics } from "../../api/lyrics/lyrics";

const SongLyrics = ({
  songTitle,
  artistName,
}: {
  songTitle: string;
  artistName: string;
}) => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); // 🎯 Açılıp kapanma kontrolü

  useEffect(() => {
    const fetchLyrics = async () => {
      setLoading(true);
      try {
        const fetchedLyrics = await getLyrics(songTitle, artistName);
        setLyrics(fetchedLyrics);
      } catch (err) {
        setError("Şarkı sözleri bulunamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [songTitle, artistName]);

  if (loading) return <Spinner size="md" color="white" />;
  if (error) return <Text color="red.400">{error}</Text>;

  const previewLyrics = lyrics ? lyrics.slice(0, 100) : "";
  const hasMore = lyrics && lyrics.length > 100;

  return (
    <Flex
      direction={"column"}
      p={5}
      color="gray.100"
      borderRadius="md"
      boxShadow="lg"
      bg={"#171717"}
      cursor={isExpanded ? "auto" : "pointer"}
      transition="background 0.3s ease-in-out"
      onClick={() => setIsExpanded(!isExpanded)}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Şarkı Sözleri
      </Text>
      <Box
        opacity={isExpanded ? 1 : 0.6}
        dangerouslySetInnerHTML={{
          __html: isExpanded
            ? lyrics || "Bu şarkı için henüz sözler bulunmamaktadır."
            : previewLyrics + (hasMore ? "..." : ""),
        }}
      />
      <Text fontSize={"14px"} mt={2}>{isExpanded ? "" : "Şarkı sözlerini gör..."}</Text>
    </Flex>
  );
};

export default SongLyrics;
