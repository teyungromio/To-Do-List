import { defineConfig } from "vite";
import react from "To-Do-List";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
