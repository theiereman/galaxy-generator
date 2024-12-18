import ViteRestart from "vite-plugin-restart";

export default {
  root: "src/",
  publicDir: "../public",
  server: {
    open: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    ViteRestart({
      restart: ["../static/**"],
    }),
  ],
};
