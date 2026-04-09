import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ THIS is what shadcn needs
    },
  },
  server: {
    proxy: {
      "/auth": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
        // ✅ Strip domain/secure flags from Set-Cookie so browser saves it on :5173
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const cookies = proxyRes.headers["set-cookie"];
            if (cookies) {
              proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
                cookie
                  .replace(/Domain=[^;]+;\s*/gi, "")
                  .replace(/SameSite=None/gi, "SameSite=Lax")
                  .replace(/Secure;\s*/gi, "")
              );
            }
          });
        },
      },
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});