import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Avatar,
  Flex,
  Spinner,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import { findUserById } from "../../api/users/users";

const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER;
const socket = io(SOCKET_SERVER);

interface User {
  _id: string;
  username: string;
  avatar?: string | null;
}

const OnlineUsersOnTheSong = ({ songId }: { songId: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { onOpen } = useDisclosure();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    let userId = null;

    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        userId = parsedAuth?.user?.id;
      } catch (error) {
        console.error("❌ LocalStorage parse hatası:", error);
      }
    }

    if (!userId) {
      userId = `user_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("userId", userId);
    }

    setCurrentUserId(userId);
    socket.emit("joinSong", { songId, userId });

    socket.on("updateUsersOnSong", async ({ songId: updatedSongId, users }) => {
      if (updatedSongId === songId) {
        setLoading(true);

        const enrichedUsers = await Promise.all(
          users.map(async (user: User) => {
            if (!user.username) {
              try {
                const fetchedUser = await findUserById(user._id);
                return (
                  fetchedUser || {
                    _id: user._id,
                    username: "Bilinmeyen Kullanıcı",
                    avatar: null,
                  }
                );
              } catch (err) {
                return {
                  _id: user._id,
                  username: "Bilinmeyen Kullanıcı",
                  avatar: null,
                };
              }
            }
            return user;
          })
        );

        setUsers(enrichedUsers);
        setLoading(false);
      }
    });

    return () => {
      socket.emit("leaveSong", { songId, userId });
    };
  }, [songId]);

  return (
    <>
      <Menu>
        <MenuButton>
          <Box
            bg="#171717"
            p={3}
            borderRadius="md"
            cursor="pointer"
            onClick={onOpen}
            boxShadow={"lg"}
            _hover={{ bg: "#212121" }}>
            <Flex
              gap={"1"}
              direction={"column"}
              align={"center"}
              justify={"center"}>
              <Flex gap={"2"} align={"center"} justify={"center"}>
                <Box
                  bg={"green.400"}
                  width={"3"}
                  height={"3"}
                  borderRadius={"full"}></Box>
                <Text fontSize="md" fontWeight="bold" color="white">
                  {users.length}
                </Text>
              </Flex>
              <Text fontSize="xs" color="gray.400">
                Dinleyen
              </Text>
            </Flex>
          </Box>
        </MenuButton>
        <MenuList bg="#1e1e1e" borderColor="#333" color="white" minW="200px">
          <Text px={5} py={2} fontWeight="bold">
            Sizinle beraber dinleyenler
          </Text>
          {loading ? (
            <Flex justify="center">
              <Spinner size="lg" />
            </Flex>
          ) : users.length > 0 ? (
            users.map((user) => {
              const isCurrentUser = user._id === currentUserId;
              return (
                <MenuItem
                  key={user._id}
                  bg="transparent"
                  _hover={isCurrentUser ? {} : { bg: "#212121" }}
                  cursor={isCurrentUser ? "default" : "pointer"}>
                  <Flex align="center" p={2} gap={"0.5rem"}>
                    <Avatar
                      src={user.avatar || "/assets/default_avatar.png"}
                      size="sm"
                    />
                    <Text fontSize="md">
                      {isCurrentUser ? "Siz" : user.username}
                    </Text>
                  </Flex>
                </MenuItem>
              );
            })
          ) : (
            <Text
              fontSize="sm"
              color="gray.400"
              textAlign="center"
              px={5}
              py={2}>
              Şu anda kimse dinlemiyor
            </Text>
          )}
        </MenuList>
      </Menu>
    </>
  );
};

export default OnlineUsersOnTheSong;
