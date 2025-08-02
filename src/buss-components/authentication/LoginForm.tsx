import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthStore } from "../../stores/authStore";
import { login } from "../../api/auth/auth";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required("Kullanıcı adı veya eposta gereklidir")
    .test(
      "is-valid",
      "Geçerli bir kullanıcı adı veya e-posta sağlayınız",
      (value) =>
        /^[a-zA-Z_ ]{3,}$/.test(value || "") || // Kullanıcı adı için regex
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "") // E-posta için regex
    ),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre gereklidir"),
});

type LoginFormInputs = {
  usernameOrEmail: string;
  password: string;
};

export const LoginForm = ({
  switchToSignup,
}: {
  switchToSignup: () => void;
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const loginToStore = useAuthStore((state) => state.login);

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data.usernameOrEmail, data.password)
      .then((response) => {
        const { accessToken, refreshToken } = response;
        const user = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        };

        loginToStore(accessToken, user, 15 * 60);

        toast({
          title: "Başarılı!",
          description: "Başarıyla oturum açıldı.",
          status: "success",
          duration: 1500,
          isClosable: true,
          position: "top-right",
        });

        navigate("/");
      })
      .catch((err) => {
        toast({
          title: "Hata!",
          description: err.response?.data?.message || "Bir hata oluştu.",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.usernameOrEmail}>
            <FormLabel>Kullanıcı Adı / Eposta</FormLabel>
            <Input
              autoFocus
              placeholder="Kullanıcı adınızı veya epostanızı giriniz"
              {...register("usernameOrEmail")}
            />
            <FormErrorMessage>
              {errors.usernameOrEmail?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Şifre</FormLabel>
            <Input
              type="password"
              placeholder="Şifrenizi giriniz"
              {...register("password")}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="gray"
            isLoading={isSubmitting}
            width="full"
            isDisabled={!isValid}>
            Giriş Yap
          </Button>
        </VStack>
      </form>
      <Text
        mt={4}
        textAlign="center"
        fontSize={"15px"}
        color={"whiteAlpha.700"}>
        <Link color="blue.300" onClick={switchToSignup}>
          Kayıt Ol
        </Link>
      </Text>
    </Box>
  );
};
