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
import { others } from "~/database/schema.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const other = await db.query.others.findFirst({ where: eq(others.id, id) });
  if (!other) {
    throw json({ message: "other not found" }, { status: 400 });
  }

  return json({ other });
}

export default function Other() {
  const { other } = useLoaderData<typeof loader>();
  const { id } = useParams();

  return (
    <div className="grid grid-rows-[1fr_auto] h-full bg-gray-800 p-4 gap-4">
      <div className="bg-gray-100 rounded-md p-4 flex justify-center items-center">
        <span className="text-2xl">{other.french}</span>
      </div>
      <div className="flex justify-between">
        <Button asChild variant={"link"}>
          <Link to="/" prefetch="render">
            Accueil
          </Link>
        </Button>
        <Button asChild>
          <Link to={`/other/${id}/response`} prefetch="render">
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
