import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "auth/login/index.html"),
        register: resolve(__dirname, "auth/register/index.html"),
        listings: resolve(__dirname, "listings/index.html"),
        single: resolve(__dirname, "listings/single/index.html"),
        create: resolve(__dirname, "listings/create/index.html"),
        profile: resolve(__dirname, "profile/index.html"),
      },
    },
  },
});
