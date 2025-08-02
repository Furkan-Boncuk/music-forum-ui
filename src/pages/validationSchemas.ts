import * as yup from "yup";

// Giriş için şema
const loginSchema = yup.object({
  usernameOrEmail: yup
    .string()
    .required("Kullanıcı adı veya e-posta gereklidir")
    .test(
      "is-valid",
      "Geçerli bir kullanıcı adı veya e-posta sağlayınız",
      (value) =>
        /^[a-zA-Z0-9_]{3,}$/.test(value || "") || // Kullanıcı adı için regex
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "") // E-posta için regex
    ),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre gereklidir"),
});

// Kayıt için şema
const signupSchema = yup.object({
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

// Dinamik Yup Resolver
export const getSchema = (isSignup: boolean) => (isSignup ? signupSchema : loginSchema);
