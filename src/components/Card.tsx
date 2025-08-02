import { Box, Heading, Text, Button } from "@chakra-ui/react";

const Card = ({ title, description }: { title: string; description: string }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      shadow="md"
    >
      <Heading as="h2" size="md" mb={2}>
        {title}
      </Heading>
      <Text mb={4}>{description}</Text>
      <Button colorScheme="blue">Read More</Button>
    </Box>
  );
};

export default Card;
