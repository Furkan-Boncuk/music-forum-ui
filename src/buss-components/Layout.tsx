import React from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useLocation } from "react-router-dom";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  const hiddenFooterPaths = ["/authentication", "/songs"];
  const hiddenNavbarPaths = ["/songs"];

  const showFooter = !hiddenFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const showNavbar = !hiddenNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {showNavbar ? <Navbar /> : <></>}
      <Box flex="1" p={showNavbar ? 4 : 0}>
        {children}
      </Box>
      {showFooter ? <Footer /> : <></>}
    </Box>
  );
};
