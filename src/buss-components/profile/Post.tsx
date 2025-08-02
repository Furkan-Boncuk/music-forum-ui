import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Post_User from "../post/Post_User";
import IPost from "../../types/IPost.interface";
import { useNavigate } from "react-router-dom";

const Post = ({ post }: { post: IPost }) => {
  const navigate = useNavigate();
  return (
    <Flex
      key={post._id}
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
  );
};

export default Post;
