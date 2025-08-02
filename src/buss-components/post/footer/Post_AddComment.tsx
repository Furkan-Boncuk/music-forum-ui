import { useState } from "react";
import { Input, useToast, Flex } from "@chakra-ui/react";
import { useAuthStore } from "../../../stores/authStore";
import { addComment } from "../../../api/comments/comments";

const Post_AddComment = ({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: () => void;
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuthStore();
  const toast = useToast();

  const handleCommentSubmit = async () => {
    if (!content.trim() || content.length < 2) return;

    if (!token) {
      toast({
        title: "Hata",
        description: "Yorum yapmak için oturum açmalısınız",
        status: "error",
        duration: 1500,
        isClosable: true,
        colorScheme: "red",
        position: "top-right",
      });
    }

    setIsSubmitting(true);
    try {
      await addComment(postId, content, token as string);
      setContent("");
      onCommentAdded();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum eklenemedi.",
        status: "error",
        duration: 1500,
        isClosable: true,
        colorScheme: "red",
        position: "top-right",
      });
      console.error("Yorum eklenemedi: ",error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCommentSubmit();
  };

  return (
    <Flex gap={2}>
      <Input
        autoFocus
        placeholder="Yorum yaz..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        isDisabled={isSubmitting}
        onKeyPress={handleKeyPress}
      />
    </Flex>
  );
};

export default Post_AddComment;
