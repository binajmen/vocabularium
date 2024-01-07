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
    <div className="flex justify-center items-center flex-col gap-8 bg-gray-800 h-full">
      UUU
      <Button asChild>
        <Link to="/random">S'entrainer</Link>
      </Button>
      <Button variant="link" asChild>
        <Link to="/enrich">Enrichir le vocabulaire</Link>
      </Button>
    </div>
  );
}
