import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  vite: {
    ssr: { external: ["drizzle-orm"] },
    plugins: [tailwindcss(), Icons({ compiler: "solid" })],
  },
});
