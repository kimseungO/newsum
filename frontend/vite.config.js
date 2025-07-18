import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:443", // ✅ 백엔드 서버 주소
        changeOrigin: true,
        secure: false, // ✅ self-signed 인증서 무시
      },
    },
  },
});
