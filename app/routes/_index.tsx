import { PlusCircledIcon, RocketIcon } from "@radix-ui/react-icons";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Vocabularium" },
    { name: "description", content: "Vocabularium" },
  ];
};

export default function Index() {
  return (
    <div className="flex items-center flex-col bg-gray-800 h-full p-8">
      <h1 className="text-3xl text-white">Vocabularium</h1>
      <div className="flex flex-col gap-8 flex-1 justify-center h-full">
        <Button asChild>
          <Link to="/random" className="inline-flex items-center gap-2">
            <RocketIcon />
            Start training
          </Link>
        </Button>
        <Button variant="link" asChild>
          <Link to="/enrich/noun" className="inline-flex items-center gap-2">
            <PlusCircledIcon />
            Enrich database
          </Link>
        </Button>
      </div>
    </div>
  );
}
