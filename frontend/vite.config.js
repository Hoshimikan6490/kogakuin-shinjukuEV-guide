import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          charset: '<meta charset="utf-8">',
        },
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
