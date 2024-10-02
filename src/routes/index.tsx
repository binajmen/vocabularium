import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUserBySession, logout } from "~/api";

export const route = {
  preload() {
    getUserBySession();
  }
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(async () => getUserBySession(), { deferStream: true });

  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="font-bold text-3xl">Hello {user()?.first_name}</h2>
      <h3 class="font-bold text-xl">Message board</h3>
      <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}
