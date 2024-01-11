import { useRouteLoaderData } from "@remix-run/react";
import { loader as rootLoader } from "~/root";

export function useUserOrNull() {
  return useRouteLoaderData<typeof rootLoader>("root")?.userId || null;
}
