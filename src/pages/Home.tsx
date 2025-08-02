import { Flex } from "@chakra-ui/react";
import PopularSongs from "../buss-components/feed/PopularSongs";
import PostsList from "../buss-components/feed/PostsList";

const Home = () => (
  <Flex
    direction={"column"}
    gap={"1rem"}
    alignItems={"center"}
    justifyContent={"center"}>
    <PopularSongs />
    <PostsList />
  </Flex>
);

export default Home;
