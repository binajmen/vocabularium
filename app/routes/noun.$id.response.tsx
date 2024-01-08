import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import TrainingLayout from "~/components/training-layout";
import { Alert } from "~/components/ui/alert";
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

  return (
    <TrainingLayout nextPath={`/random`}>
      <div className="flex justify-center items-center flex-col">
        <span className="text-3xl">{noun.singular}</span>
        <span className="text-xl">{noun.plural}</span>
      </div>
    </TrainingLayout>
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
