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
import { signup } from "../../api/auth/auth";

const signupSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .required("Kullanıcı adı gereklidir"),
  email: yup
    .string()
    .email("Geçerli bir e-posta adresi sağlayınız")
    .required("E-posta gereklidir"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre gereklidir"),
});

type SignupFormInputs = {
  username: string;
  email: string;
  password: string;
};

export const SignupForm = ({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormInputs>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormInputs) => {
    await signup(data.username, data.email, data.password)
      .then((res) => {
        console.log(res);

        toast({
          title: "Başarılı",
          description: "Giriş yapmak için yönlendiriliyorsunuz.",
          status: "success",
          duration: 1500,
          isClosable: true,
          colorScheme: "green",
          position: "top-right",
        });
        switchToLogin();
      })
      .catch((err) =>
        toast({
          title: "Hata",
          description: err.response?.data?.message || "Bir hata oluştu.",
          status: "error",
          duration: 1500,
          isClosable: true,
          colorScheme: "red",
          position: "top-right",
        })
      );
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Kullanıcı Adı</FormLabel>
            <Input
              autoFocus
              placeholder="Kullanıcı adınızı giriniz"
              {...register("username")}
            />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Eposta</FormLabel>
            <Input
              type="email"
              placeholder="Eposta adresinizi giriniz"
              {...register("email")}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
            Kayıt Ol
          </Button>
        </VStack>
      </form>
      <Text
        mt={4}
        textAlign="center"
        fontSize={"15px"}
        color={"whiteAlpha.700"}>
        <Link color="blue.300" onClick={switchToLogin}>
          Giriş Yap
        </Link>
      </Text>
    </Box>
  );
};
