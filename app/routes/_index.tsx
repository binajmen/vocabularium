import {
  EnterIcon,
  ExitIcon,
  FileTextIcon,
  PlusCircledIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useUserOrNull } from "~/hooks/use-route-loader";
import { redirectWithClearedCookie } from "~/lib/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Vocabularium" },
    { name: "description", content: "Vocabularium" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    return redirectWithClearedCookie();
  }

  return null;
}

export default function Index() {
  const user = useUserOrNull();

  return (
    <div className="flex items-center flex-col bg-gray-800 h-full p-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl text-white">Vocabularium</h1>
        {user && <span className="text-gray-400">Hello {user.name}!</span>}
      </div>
      <div className="flex flex-col gap-8 flex-1 justify-center h-full">
        <Button asChild>
          <Link to="/random" className="inline-flex items-center gap-2">
            <RocketIcon />
            Start training
          </Link>
        </Button>
        {user && (
          <>
            <Button asChild>
              <Link to="/study" className="inline-flex items-center gap-2">
                <FileTextIcon />
                Study
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link
                to="/enrich/noun"
                className="inline-flex items-center gap-2"
              >
                <PlusCircledIcon />
                Enrich database
              </Link>
            </Button>
          </>
        )}
      </div>
      {user ? (
        <Form method="post">
          <Button type="submit" name="intent" value="logout" variant="link">
            <ExitIcon />
            Logout
          </Button>
        </Form>
      ) : (
        <Button variant="link" asChild>
          <Link to="/login">
            <EnterIcon />
            Login
          </Link>
        </Button>
      )}
    </div>
  );
}
