import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// 路径查找
const pathResolve = (dir) => {
  return resolve(__dirname, ".", dir);
};

// 设置别名
const alias = {
  "@": pathResolve("src"),
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias,
  },
  server: {
    port: 5174,
  },
  plugins: [vue()],
  build: {
    sourcemap: false,
    brotliSize: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 4000,
  },
});
