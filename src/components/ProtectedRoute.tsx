import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Center, Spinner } from "@chakra-ui/react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // Kullanıcı durumu kontrol ediliyorsa yükleme ekranı göster
  if (isCheckingAuth) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isLoggedIn) {
    return <Navigate to="/authentication" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
