import React from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useLocation } from "react-router-dom";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  const hiddenFooterPaths = ["/authentication"];

  const showFooter = !hiddenFooterPaths.includes(location.pathname);

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1" p={4}>
        {children}
      </Box>
      {showFooter && <Footer />}
    </Box>
  );
};
