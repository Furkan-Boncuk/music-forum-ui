import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  server: {
    host: "0.0.0.0", // Tüm IP'lerden erişime izin ver
    port: 5173, // (Değiştirebilirsin)
    strictPort: true, // Belirtilen portu kesin kullan
    hmr: {
      clientPort: 5173, // HMR'nin doğru çalışması için
    },
    allowedHosts: [".ngrok-free.app", "192.168.0.110", "localhost"], // Buraya kendi IP veya ngrok domainini ekle
  },
});
