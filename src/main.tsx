import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import "./index.css";
import { theme as chakraTheme } from "./theme/index";
import { AuthProvider } from "./authContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider theme={chakraTheme}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);
