import { HomeIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function ComeBackLater() {
  return (
    <div className="flex items-center justify-center flex-col gap-8 bg-gray-800 text-white h-full p-8">
      <h1 className="text-3xl font-bold">Come back later</h1>
      <p className="text-xl sm:w-1/2 text-center">
        It seems that you exhausted the whole database, good job! 🔥
      </p>
      <p className="text-xl sm:w-1/2 text-center">
        You should rest and come back tomorrow 😉
      </p>
      <Button variant="link" asChild>
        <Link to="/" className="inline-flex items-center gap-2">
          <HomeIcon />
          Go home
        </Link>
      </Button>
    </div>
  );
}
