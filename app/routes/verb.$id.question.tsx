import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { TrainingLayout } from "~/components/training-layout";
import { db } from "~/database/db.server";
import { verbs } from "~/database/schema.server";
import { http } from "~/lib/http-responses";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const verb = await db.query.verbs.findFirst({ where: eq(verbs.id, id) });
  if (!verb) {
    throw http.notFound({ message: "verb not found" });
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
