import { defineConfig } from "@solidjs/start/config";
// import AutoImport from "unplugin-auto-import/vite";
// import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  vite: {
    ssr: { external: ["drizzle-orm"] },
    plugins: [
      // AutoImport({
      //   resolvers: [
      //     IconsResolver({
      //       prefix: "Icon",
      //       extension: "jsx",
      //     }),
      //   ],
      // }),
      Icons({
        compiler: "solid",
      }),
    ],
  },
});
