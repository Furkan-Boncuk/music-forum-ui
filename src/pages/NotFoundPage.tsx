import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      textAlign="center"
      p={5}
      color="white"
      borderRadius="md"
      boxShadow="lg">
      <Flex direction={"column"} gap={2}>
        <Text fontSize="7xl" fontWeight="bold">
          404
        </Text>
        <Text>Aradığınız Sayfa Bulunamadı</Text>
        <Text fontSize={"15px"} color={"gray"}>
          Hatalı bir URL yönlendirmesiyle karşılaşmış olabilirsiniz veya sayfa
          içeriği silinmiş olabilir.
        </Text>
      </Flex>
      <Button colorScheme="gray" mt={4} onClick={() => navigate("/")}>
        Ana Sayfaya Dön
      </Button>
    </Box>
  );
};

export default NotFoundPage;
