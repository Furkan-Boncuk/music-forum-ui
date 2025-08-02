import { Box, IconButton, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaPlus,
  FaBell,
  FaRegBell,
  FaUser,
  FaRegUser,
} from "react-icons/fa";
import { LuCirclePlus } from "react-icons/lu";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSelected = (path: string) => location.pathname === path;

  const menuItems = [
    {
      label: "Home",
      selectedIcon: FaHome,
      unselectedIcon: FaHome,
      path: "/",
    },
    {
      label: "Search",
      selectedIcon: FaSearch,
      unselectedIcon: FaSearch,
      path: "/search",
    },
    {
      label: "Write",
      selectedIcon: LuCirclePlus,
      unselectedIcon: FaPlus,
      path: "/write",
    },
    {
      label: "Notifications",
      selectedIcon: FaBell,
      unselectedIcon: FaRegBell,
      path: "/notifications",
    },
    {
      label: "Settings",
      selectedIcon: FaUser,
      unselectedIcon: FaRegUser,
      path: "/settings",
    },
  ];

  return (
    <Box
      as="footer"
      bg={"#171717"}
      color="white"
      p={2}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      boxShadow="md"
      zIndex={10}>
      <Flex justify="space-around" align="center">
        {menuItems.map((item) => (
          <IconButton
            key={item.label}
            aria-label={item.label}
            icon={
              isSelected(item.path) ? (
                <item.selectedIcon />
              ) : (
                <item.unselectedIcon />
              )
            }
            variant="ghost"
            colorScheme={"gray"}
            bg={isSelected(item.path) ? "#424242" : "transparent"}
            onClick={() => navigate(item.path)}
            fontSize="xl"
            _hover={{ bg: "#424242" }}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default Footer;
