import { HomeIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { Link, Outlet } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Enrich() {
  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" asChild>
        <Link to="/" className="inline-flex gap-2 items-center">
          <HomeIcon />
          Go back
        </Link>
      </Button>
      <Tabs defaultValue="noun" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="noun" asChild>
            <Link to="noun">Noun</Link>
          </TabsTrigger>
          <TabsTrigger value="verb">
            <Link to="verb">Verb</Link>
          </TabsTrigger>
          <TabsTrigger value="other">
            <Link to="other">Other</Link>
          </TabsTrigger>
          <TabsTrigger value="raw">
            <Link to="raw" className="inline-flex gap-2 items-center">
              <MagicWandIcon />
              Raw
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
}
