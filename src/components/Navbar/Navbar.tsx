import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Spacer,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react";
import { useAuthStore } from "../../stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack as IconGoBack } from "react-icons/io5";

export const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // 📌 Dinamik başlık belirleme
  const getPageTitle = () => {
    if (location.pathname.startsWith("/profile")) return "Profil";
    if (location.pathname.startsWith("/posts/")) return "Gönderi";
    if (location.pathname.startsWith("/settings")) return "Ayarlar";
    return "Müzik Forum App"; // Varsayılan başlık
  };

  return (
    <Box bg="#171717" color="white" px={4} py={2.5} shadow="lg">
      <Flex alignItems="center">
        {location.pathname !== "/" && (
          <IconButton
            aria-label="Geri Git"
            icon={<IconGoBack size={"18px"} />}
            variant="ghost"
            color="white"
            onClick={() => navigate(-1)}
            size="sm"
            mr={2}
            borderRadius={"full"}
          />
        )}
        <Text fontSize="lg" fontWeight="bold">
          {getPageTitle()}
        </Text>
        <Spacer />
        {isLoggedIn && user ? (
          <Flex alignItems="center" gap={4}>
            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  bg={"#424242"}
                  color={"white"}
                  fontWeight={800}
                  src={user?.profileImage}
                  name={user?.username}
                />
              </MenuButton>
              <MenuList bg="#1e1e1e" borderColor="#333" color="white">
                <Text px={3} py={1} fontWeight="bold">
                  {user?.username}
                </Text>
                <MenuDivider />
                <MenuItem
                  bg={"transparent"}
                  _hover={{ bg: "#333" }}
                  onClick={() => navigate("/settings")}>
                  Ayarlar
                </MenuItem>
                <MenuItem
                  bg={"transparent"}
                  _hover={{ bg: "#333" }}
                  onClick={() => {
                    logout();
                    window.location.href = "/auth"; // Oturum kapat ve giriş ekranına yönlendir
                  }}>
                  Çıkış Yap
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          location.pathname !== "/auth" && (
            <Link href="/auth">
              <Button size="sm" colorScheme="gray">
                Giriş Yap
              </Button>
            </Link>
          )
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
