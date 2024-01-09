import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { TrainingLayout } from "~/components/training-layout";
import { db } from "~/database/db.server";
import { nouns } from "~/database/schema.server";
import { http } from "~/lib/http-responses";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const noun = await db.query.nouns.findFirst({ where: eq(nouns.id, id) });
  if (!noun) {
    throw http.notFound({ message: "Noun not found" });
  }

  return json({ noun });
}

export default function Noun() {
  const { noun } = useLoaderData<typeof loader>();
  const { id } = useParams();

  return (
    <TrainingLayout
      editPath={`/enrich/noun?edit=${id}`}
      nextPath={`/noun/${id}/answer`}
      stage="question"
    >
      <span className="text-3xl text-center">{noun.french}</span>
    </TrainingLayout>
  );
}
