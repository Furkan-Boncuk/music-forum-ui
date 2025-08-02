import { Box, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FaRegHeart as IconHeartOutlined } from "react-icons/fa";
import { FaHeart as IconHeart } from "react-icons/fa6";
import { FiMessageCircle as IconCommentOutlined } from "react-icons/fi";
import { TbMessageCircleFilled as IconComment } from "react-icons/tb";
import { FaRegBookmark as IconBookmarkOutlined } from "react-icons/fa";
import { FaBookmark as IconBookmark } from "react-icons/fa6";
import { RiShareForwardLine as IconShareOutlined } from "react-icons/ri";
import { RiShareForwardFill as IconShare } from "react-icons/ri";
import { useAuthStore } from "../../../stores/authStore";
import {
  sharePost,
  toggleBookmarkPost,
  toggleLikePost,
} from "../../../api/posts/posts";
import Post_Comments from "./Post_Comments";
import Post_ShareMenu from "./Post_ShareMenu";

const Post_Footer = ({
  postId,
  initialLikeCount,
  initialIsLiked,
  initialBookmarkCount,
  initialIsBookmarked,
  commentCount,
  initialShareCount,
}: {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  initialBookmarkCount: number;
  initialIsBookmarked: boolean;
  commentCount: number;
  initialShareCount: number;
}) => {
  const { token } = useAuthStore();
  const [isLikeClicked, setIsLikeClicked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [showComments, setShowComments] = useState(false);
  const toast = useToast();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [shareCount, setShareCount] = useState(initialShareCount);

  const handleLike = async () => {
    if (!token) {
      toast({
        title: "Hata",
        description: "Beğenmek için oturum açmalısınız",
        status: "error",
        duration: 1500,
        isClosable: true,
        colorScheme: "red",
        position: "top-right",
      });
    }
    try {
      const response = await toggleLikePost({ postId, token: token as string });
      setLikeCount(response.likes);
      setIsLikeClicked(!isLikeClicked);
    } catch (error) {
      console.error("Beğeni işlemi başarısız:", error);
    }
  };

  const handleBookmark = async () => {
    if (!token) {
      toast({
        title: "Hata",
        description: "Kaydetmek için oturum açmalısınız",
        status: "error",
        duration: 1500,
        isClosable: true,
        colorScheme: "red",
        position: "top-right",
      });
      return;
    }

    try {
      const response = await toggleBookmarkPost({
        postId,
        token: token as string,
      });
      setBookmarkCount(response.bookmarks);
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error("Kaydetme işlemi başarısız:", error);
      toast({
        title: "Hata",
        description: "Post kaydedilirken hata oluştu",
        status: "error",
        duration: 1500,
        isClosable: true,
        colorScheme: "red",
        position: "top-right",
      });
    }
  };

  const handleShare = async () => {
    if (!token) {
      toast({
        title: "Hata",
        description: "Paylaşmak için oturum açmalısınız",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      const response = await sharePost({ postId, token });
      setShareCount(response.shareCount);
    } catch (error) {
      console.error("Paylaşım başarısız:", error);
    }
  };

  return (
    <Flex direction={"column"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex gap={"1rem"}>
          <Flex alignItems={"center"}>
            <IconButton
              aria-label="Beğen"
              variant={"ghost"}
              icon={
                isLikeClicked ? (
                  <IconHeart color="red" />
                ) : (
                  <IconHeartOutlined />
                )
              }
              onClick={handleLike}
              size="sm"
              borderRadius={"full"}
            />
            <Text fontSize={"13px"} color={"gray.300"}>
              {likeCount}
            </Text>
          </Flex>
          <Flex alignItems={"center"}>
            <IconButton
              aria-label="Yorumlar"
              variant={"ghost"}
              icon={
                showComments ? (
                  <IconComment color="" size={"17px"} />
                ) : (
                  <IconCommentOutlined size={"17px"} />
                )
              }
              onClick={() => setShowComments(!showComments)}
              size="sm"
              borderRadius={"full"}
            />
            <Text fontSize={"13px"} color={"gray.300"}>
              {commentCount}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={"1rem"}>
          <Flex alignItems={"center"}>
            <IconButton
              aria-label="Kaydet"
              variant={"ghost"}
              icon={
                isBookmarked ? (
                  <IconBookmark color="#ffae00" />
                ) : (
                  <IconBookmarkOutlined />
                )
              }
              onClick={handleBookmark}
              size="sm"
              borderRadius={"full"}
            />
            <Text fontSize={"13px"} color={"gray.300"}>
              {bookmarkCount}
            </Text>
          </Flex>
          <Post_ShareMenu
            postId={postId}
            initialShareCount={initialShareCount}
          />
        </Flex>
      </Flex>
      <Flex>
        {showComments && (
          <Box width={"100%"} bg="transparent" borderRadius="md">
            <Post_Comments postId={postId} />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default Post_Footer;
