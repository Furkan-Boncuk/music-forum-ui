import { useEffect, useState } from "react";
import { Box, Text, Avatar, Flex, Spinner, Center } from "@chakra-ui/react";
import { getComments } from "../../../api/comments/comments";
import Post_AddComment from "./Post_AddComment";
import { tr } from "date-fns/locale";
import { formatDistanceToNowStrict } from "date-fns";

const Post_Comments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data.comments);
    } catch (error) {
      console.error("Yorumlar alınırken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <Flex
      direction={"column"}
      gap={"0.5rem"}
      p={3}
      bg="transparent"
      width={"100%"}
      borderRadius="md" boxShadow={"lg"}>
      <Text fontSize="sm" fontWeight="bold" color={"gray.200"} mb={2}>
        Yorumlar ({comments.length})
      </Text>

      <Post_AddComment postId={postId} onCommentAdded={fetchComments} />

      {loading ? (
        <Center m={3}>
          <Spinner size="sm" />
        </Center>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <Flex key={comment._id} align="center" p={1}>
            <Avatar
              src={comment.user.avatar || "/assets/default_avatar.png"}
              size="sm"
              mr={2}
            />
            <Box>
              <Flex align={"center"} gap={2}>
                <Text fontSize="xs" fontWeight="bold">
                  {comment.user.username}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  {formatDistanceToNowStrict(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </Text>
              </Flex>
              <Text fontSize="sm" color="gray.300">
                {comment.content}
              </Text>
            </Box>
          </Flex>
        ))
      ) : (
        <Text fontSize="sm" color="gray.400" ml={1}>
          Henüz yorum yapılmamış.
        </Text>
      )}
    </Flex>
  );
};

export default Post_Comments;
