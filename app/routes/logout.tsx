import { redirectWithClearedCookie } from "~/lib/auth.server";

export async function loader() {
  return redirectWithClearedCookie();
}
