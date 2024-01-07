import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { db } from "~/database/db.server";
import { nouns } from "~/database/schema.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const noun = await db.query.nouns.findFirst({ where: eq(nouns.id, id) });
  if (!noun) {
    throw json({ message: "Noun not found" }, { status: 400 });
  }

  return json({ noun });
}

export default function Noun() {
  const { noun } = useLoaderData<typeof loader>();
  const { id } = useParams();

  return (
    <div className="grid grid-rows-[1fr_auto] h-full bg-gray-800 p-4 gap-4">
      <div className="bg-gray-100 rounded-md p-4 flex justify-center items-center">
        <span className="text-2xl">{noun.french}</span>
      </div>
      <div className="flex justify-between">
        <Button asChild variant={"link"}>
          <Link to="/" prefetch="render">
            Accueil
          </Link>
        </Button>
        <Button asChild>
          <Link to={`/noun/${id}/response`} prefetch="render">
            Voir la réponse
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="p-4">
      {isRouteErrorResponse(error) ? (
        <Alert variant="destructive">{error.data.message}</Alert>
      ) : (
        <Alert variant="destructive">Unknown error</Alert>
      )}
    </div>
  );
}
