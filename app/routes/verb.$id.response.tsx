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
import { verbs } from "~/database/schema.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const verb = await db.query.verbs.findFirst({ where: eq(verbs.id, id) });
  if (!verb) {
    throw json({ message: "verb not found" }, { status: 400 });
  }

  return json({ verb });
}

export default function Verb() {
  const { verb } = useLoaderData<typeof loader>();
  const { id } = useParams();

  return (
    <div className="grid grid-rows-[1fr_auto] h-full bg-gray-800 p-4 gap-4">
      <div className="bg-gray-100 rounded-md p-4 flex justify-center items-center flex-col">
        <span className="text-2xl mb-8">{verb.infinitive}</span>
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 text-lg">
          <span className="text-right">ich</span>
          <span className="font-bold">{verb.present.s1}</span>
          <span className="text-right">du</span>
          <span className="font-bold">{verb.present.s2}</span>
          <span className="text-right">er/sie/es</span>
          <span className="font-bold">{verb.present.s3}</span>
          <span className="text-right">wir</span>
          <span className="font-bold">{verb.present.p1}</span>
          <span className="text-right">ihr</span>
          <span className="font-bold">{verb.present.p2}</span>
          <span className="text-right">sie/Sie</span>
          <span className="font-bold">{verb.present.p3}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <Button asChild variant={"link"}>
          <Link to={`/verb/${id}/question`} prefetch="render">
            Retour
          </Link>
        </Button>
        <Button asChild>
          <Link to={`/random`} prefetch="render">
            Continuer
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
