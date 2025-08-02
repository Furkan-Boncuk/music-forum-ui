import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Avatar,
  Image,
  Flex,
  Button,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchUserLikedPosts,
  fetchUserRecentSongs,
  toggleFollowUser,
} from "../api/profile/profile";
import { useAuthStore } from "../stores/authStore";
import Post from "../buss-components/profile/Post";
import IPost from "../types/IPost.interface";
import { ISong } from "../types/ISong.interface";
import { IUser } from "../types/IUser";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [recentSongs, setRecentSongs] = useState<ISong[] | null>(null);
  const { token, user: _user } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await fetchUserProfile(userId as string);
        setUser(userData);
        setIsFollowing(userData.followers.includes(userData._id));

        const userPosts = await fetchUserPosts(userId as string);
        setPosts(userPosts);

        const userLikedPosts = await fetchUserLikedPosts(userId as string);
        setLikedPosts(userLikedPosts);

        const userRecentSongs = await fetchUserRecentSongs(userId as string);
        setRecentSongs(userRecentSongs);
      } catch (error) {
        console.error("Profil yüklenemedi:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    await toggleFollowUser(userId as string, token as string);
    setIsFollowing(!isFollowing);
  };

  if (loading) return <Spinner />;

  return (
    <Box maxW={"600px"} mx={"auto"}>
      <Image
        src={user?.banner || "/assets/default_banner.png"}
        border={"1px solid #444"}
        borderRadius={"5px"}
        w="100%"
        h="150px"
        objectFit="cover"
      />
      <Flex align="center" mt={-8} ml={4}>
        <Avatar src={user?.avatar} size="lg" />
        <Box ml={4}>
          <Text fontSize="xl" fontWeight="bold">
            {user?.username}
          </Text>
          <Text fontSize="sm" color="gray.400">
            @{user?.userTag}
          </Text>
        </Box>
      </Flex>
      <Flex justify="space-between" p={4}>
        {userId !== _user?.id && (
          <Button
            onClick={handleFollow}
            borderRadius={"full"}
            colorScheme="gray">
            {isFollowing ? "Takibi Bırak" : "Takip Et"}
          </Button>
        )}
        <Text fontSize={"14px"}>
          <strong>{user?.posts.length}</strong> Gönderi
        </Text>
        <Text fontSize={"14px"}>
          <strong>{user?.followers.length}</strong> Takipçi
        </Text>
        <Text fontSize={"14px"}>
          <strong>{user?.followings.length}</strong> Takip Edilen
        </Text>
      </Flex>

      <Tabs isFitted variant="line" colorScheme="">
        <TabList>
          <Tab>Gönderiler</Tab>
          <Tab>Beğeniler</Tab>
          <Tab>Yorumlar</Tab>
          <Tab>Aktivite</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Box key={post._id} p={4}>
                  <Post post={post} />
                </Box>
              ))
            ) : (
              <Text>Henüz gönderi yok.</Text>
            )}
          </TabPanel>
          <TabPanel>
            {likedPosts.length > 0 ? (
              likedPosts.map((post: IPost) => (
                <Box key={post._id} p={4} borderBottom="1px solid gray">
                  <Text>{post.title}</Text>
                </Box>
              ))
            ) : (
              <Text>Henüz beğeni yok.</Text>
            )}
          </TabPanel>
          <TabPanel>
            {/* {likedPosts.length > 0 ? (
              likedPosts.map((post: IPost) => (
                <Box key={post._id} p={4} borderBottom="1px solid gray">
                  <Text>{post.title}</Text>
                </Box>
              ))
            ) : ( */}
            <Text>Henüz yorum yok.</Text>
            {/* )} */}
          </TabPanel>
          <TabPanel>
            {(recentSongs?.length || 0) > 0 ? (
              recentSongs?.map((song) => (
                <Box key={song._id} p={4} borderBottom="1px solid gray">
                  <Text>
                    {song.title} - {song.artist}
                  </Text>
                </Box>
              ))
            ) : (
              <Text>Henüz dinlenen şarkı yok.</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfilePage;
