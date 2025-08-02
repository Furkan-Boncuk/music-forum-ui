import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useClipboard,
  useToast,
  Flex,
  Text,
} from "@chakra-ui/react";
import { RiShareForwardLine as IconShareOutlined } from "react-icons/ri";
import { FaWhatsapp, FaTwitter, FaTelegram } from "react-icons/fa";
import { MdContentCopy, MdShare } from "react-icons/md";
import { sharePost } from "../../../api/posts/posts";
import { useAuthStore } from "../../../stores/authStore";

const Post_ShareMenu = ({
  postId,
  initialShareCount,
}: {
  postId: string;
  initialShareCount: number;
}) => {
  const { token } = useAuthStore();
  const [shareCount, setShareCount] = useState(initialShareCount);
  const toast = useToast();

  const postUrl = `${window.location.origin}/posts/${postId}`;
  const { onCopy } = useClipboard(postUrl);

  const handleShare = async () => {
    if (!token) {
      toast({
        title: "Hata",
        description: "Paylaşmak için oturum açmalısınız.",
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

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Paylaş",
          text: `Bu paylaşımı görmek için tıklayın: ${postUrl}`,
          url: postUrl,
        })
        .catch((error) => console.log("Paylaşım başarısız:", error));
    }
  };

  return (
    <Menu>
      <MenuButton>
        <Flex alignItems={"center"}>
          <IconButton
            aria-label="Paylaş"
            variant={"ghost"}
            icon={<IconShareOutlined size={"18px"} />}
            onClick={handleShare}
            size="sm"
            borderRadius={"full"}
          />
          <Text fontSize={"13px"} color={"gray.300"}>
            {shareCount}
          </Text>
        </Flex>
      </MenuButton>

      <MenuList bg="#171717" boxShadow={"lg"} border={"none"} color="white">
        <MenuItem
          icon={<MdShare size={16} />}
          onClick={handleNativeShare}
          bg="transparent"
          _hover={{ bg: "#212121" }}
        >
          Cihazda Paylaş
        </MenuItem>
        <MenuItem
          icon={<MdContentCopy size={16} />}
          onClick={() => {
            handleShare();
            onCopy();
            toast({
              title: "Bağlantı Kopyalandı!",
              description: "Post bağlantısı panoya kopyalandı.",
              status: "success",
              duration: 1500,
              isClosable: true,
              position: "top-right",
            });
          }}
          bg="transparent"
          _hover={{ bg: "#212121" }}>
          Bağlantıyı Kopyala
        </MenuItem>
        <MenuItem
          icon={<FaWhatsapp size={16} />}
          as="a"
          href={`https://wa.me/?text=${encodeURIComponent(
            `Merhaba! Bu paylaşımı görmek için tıklayın: ${postUrl}`
          )}`}
          onClick={handleShare}
          target="_blank"
          bg="transparent"
          _hover={{ bg: "#212121" }}>
          WhatsApp'ta Paylaş
        </MenuItem>
        <MenuItem
          icon={<FaTwitter size={16} />}
          as="a"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
          )}`}
          onClick={handleShare}
          target="_blank"
          bg="transparent"
          _hover={{ bg: "#212121" }}>
          X (Twitter)'da Paylaş
        </MenuItem>
        <MenuItem
          icon={<FaTelegram size={16} />}
          as="a"
          href={`https://t.me/share/url?url=${encodeURIComponent(postUrl)}`}
          target="_blank"
          bg="transparent"
          onClick={handleShare}
          _hover={{ bg: "#212121" }}>
          Telegram'da Paylaş
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Post_ShareMenu;
