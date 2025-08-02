import { useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { LoginForm } from "../buss-components/authentication/LoginForm";
import { SignupForm } from "../buss-components/authentication/SignupForm";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  const switchToLogin = () => setIsSignup(false);
  const switchToSignup = () => setIsSignup(true);

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="lg" borderRadius="md">
      <Heading mb={6} textAlign="center">
        {isSignup ? "Kayıt Ol" : "Giriş Yap"}
      </Heading>
      {isSignup ? (
        <SignupForm switchToLogin={switchToLogin} />
      ) : (
        <LoginForm switchToSignup={switchToSignup} />
      )}
    </Box>
  );
};

export default AuthPage;
