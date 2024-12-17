import ViteRestart from "vite-plugin-restart";

export default {
  root: "src/",
  publicDir: "../static/",
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
