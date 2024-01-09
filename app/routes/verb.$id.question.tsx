import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import { TrainingLayout } from "~/components/training-layout";
import { Alert } from "~/components/ui/alert";
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
    <TrainingLayout
      editPath={`/enrich/verb/${id}`}
      nextPath={`/verb/${id}/answer`}
      stage="question"
    >
      <span className="text-3xl text-center">{verb.french}</span>
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
