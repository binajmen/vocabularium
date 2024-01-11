import { HomeIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { redirectIfNotLoggedInLoader } from "~/lib/auth.server";

export const loader = redirectIfNotLoggedInLoader;

export default function Enrich() {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop();

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" asChild>
        <Link to="/" className="inline-flex items-center gap-2">
          <HomeIcon />
          Go back
        </Link>
      </Button>
      <Tabs defaultValue={currentTab}>
        <TabsList>
          <TabsTrigger value="noun" asChild>
            <Link to="noun">Noun</Link>
          </TabsTrigger>
          <TabsTrigger value="verb" asChild>
            <Link to="verb">Verb</Link>
          </TabsTrigger>
          <TabsTrigger value="other" asChild>
            <Link to="other">Other</Link>
          </TabsTrigger>
          <TabsTrigger value="raw" asChild>
            <Link to="raw" className="inline-flex items-center gap-2">
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
