import { Avatar, Flex, Text } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const Post_User = ({
    avatar,
    username,
    userId,
    postCreatedAt
}: {
    avatar: string;
    username: string;
    userId: string;
    postCreatedAt: Date;
}) => {
  const navigate = useNavigate();
  return (
    <Flex align="center" gap={3}>
      <Avatar
        src={avatar || "/assets/default_avatar.png"}
        boxSize="30px"
        borderRadius="full"
        onClick={() => navigate(`/profile/${userId}`)}
      />
      <Flex direction={"column"}>
        <Text fontWeight={"500"} fontSize={"14px"}>
          {username}
        </Text>
        <Text fontSize="xs" color="gray.300">
          {formatDistanceToNowStrict(new Date(postCreatedAt), {
            addSuffix: true,
            locale: tr,
          })}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Post_User;