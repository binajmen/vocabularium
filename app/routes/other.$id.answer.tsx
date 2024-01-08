import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import { TrainingLayout } from "~/components/training-layout";
import { Alert } from "~/components/ui/alert";
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

  return (
    <TrainingLayout nextPath={`/random`} stage="answer">
      <span className="text-3xl">{other.expression}</span>
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
