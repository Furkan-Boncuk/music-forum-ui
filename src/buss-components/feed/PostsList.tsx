import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text, Image, Spinner, Flex, Avatar } from "@chakra-ui/react";
import { getPosts } from "../../api/posts/posts";
import { formatDistanceToNowStrict } from "date-fns";
import { tr } from "date-fns/locale";
import Post_User from "../post/Post_User";

const PostsList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPosts = useCallback(async () => {
    if (isFetching || page > totalPages) return;

    setIsFetching(true);
    try {
      const { posts: newPosts, totalPages } = await getPosts({
        page,
        limit: 10,
      });

      setPosts((prev) => [
        ...new Map([...prev, ...newPosts].map((p) => [p._id, p])).values(),
      ]);

      setTotalPages(totalPages);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Postlar alınırken hata oluştu:", error);
    }
    setIsFetching(false);
  }, [page, totalPages]);

  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };
    loadInitialPosts();
  }, []);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching || loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchPosts, isFetching, loading]
  );

  return (
    <Box w="100%" maxW="600px" mx="auto" mt={5} p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Son Paylaşımlar
      </Text>

      {loading ? (
        <Flex justify="center">
          <Spinner size="lg" color="white" />
        </Flex>
      ) : posts.length > 0 ? (
        posts.map((post, index) => (
          <Flex
            key={post._id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            direction={"column"}
            p={4}
            mb={3}
            borderRadius="md"
            boxShadow="lg"
            bg="#171717"
            gap={2}
            cursor="pointer"
            onClick={() => navigate(`/posts/${post._id}`)}
            _hover={{ bg: "#212121" }}>
            <Post_User
              avatar={post.user.avatar}
              username={post.user.username}
              postCreatedAt={post.createdAt}
              userId={post.user._id}
            />
            <Text textTransform={"capitalize"}>{post.title}</Text>

            <Flex align="center" gap={3} mb={3}>
              <Image
                src={post.song.albumArt || "/assets/song_placeholder_image.png"}
                boxSize="45px"
                borderRadius="md"
              />
              <Box>
                <Text fontWeight={"bold"} fontSize={"sm"}>
                  {post.song.title}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  {post.song.artist}
                </Text>
              </Box>
            </Flex>
          </Flex>
        ))
      ) : (
        <Text textAlign="center" color="gray.400">
          Henüz bir paylaşım yok.
        </Text>
      )}

      {!loading && isFetching && (
        <Flex justify="center" mt={4}>
          <Spinner size="md" color="white" />
        </Flex>
      )}
    </Box>
  );
};

export default PostsList;
