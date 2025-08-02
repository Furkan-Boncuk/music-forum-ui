import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Spinner, Flex, useToast } from "@chakra-ui/react";
import SpotifyMiniPlayer from "../buss-components/songDetails/SpotifyPlayer";
import { getPostById } from "../api/posts/posts";
import { useAuthStore } from "../stores/authStore";
import OnlineUsersOnTheSong from "../buss-components/songDetails/OnlineUsersOnTheSong";
import SongLyrics from "../buss-components/feed/SongLyrics";
import Post_User from "../buss-components/post/Post_User";
import Post_Footer from "../buss-components/post/footer/Post_Footer";

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthStore();
  const toast = useToast();

  console.log(post);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById({
          token: token as string,
          postId: postId as string,
        });
        setPost(data.post);
      } catch (error) {
        console.error("Post getirilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!token) {
      toast({
        title: "Hata",
        description: "Yazıları okumak için oturum açmanız gerekmektedir",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top-right",
      });
      return;
    } else {
      fetchPost();
    }
  }, [postId, token]);

  if (loading) {
    return (
      <Flex justify="center" mt={5}>
        <Spinner size="lg" color="white" />
      </Flex>
    );
  }

  if (!post) {
    return (
      <Text textAlign="center" color="gray.400" mt={5}>
        Post bulunamadı.
      </Text>
    );
  }

  return (
    <Box maxW="600px" mx="auto" p={4}>
      {loading ? (
        <Flex justify="center" mt={5}>
          <Spinner size="lg" color="white" />
        </Flex>
      ) : (
        post && (
          <>
            <Box maxW="800px">
              <Flex direction={"column"} gap={"1rem"}>
                <Flex
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  gap="1">
                  <Box flex="5">
                    <SpotifyMiniPlayer
                      trackUri={`spotify:track:${post.song.referenceId}`}
                      songTitle={post.song.title}
                      artistName={post.song.artist}
                      albumArt={post.song.albumArt}
                    />
                  </Box>
                  <Box flex="1">
                    <OnlineUsersOnTheSong songId={post.songId!} />
                  </Box>
                </Flex>

                <SongLyrics
                  songTitle={post.song.title}
                  artistName={post.song.artist}
                />

                <Flex
                  direction={"column"}
                  p={5}
                  color="gray.100"
                  borderRadius="md"
                  boxShadow="lg"
                  bg={"#171717"}
                  gap={"1rem"}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    textTransform={"capitalize"}>
                    {post.title}
                  </Text>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: post.content,
                    }}
                  />
                  <Post_User
                    avatar={post.user.avatar}
                    username={post.user.username}
                    userId={post.user._id}
                    postCreatedAt={post.createdAt}
                  />
                  <Post_Footer
                    postId={post._id}
                    initialLikeCount={post.likes.length}
                    initialIsLiked={post.likes.includes(user?.id)}
                    initialBookmarkCount={post.bookmarks.length}
                    initialIsBookmarked={post.bookmarks.includes(user?.id)}
                    commentCount={post.comments.length}
                    initialShareCount={post.shareCount}
                  />
                </Flex>
              </Flex>
            </Box>
          </>
        )
      )}
    </Box>
  );
};

export default PostPage;
