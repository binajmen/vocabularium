import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { TrainingLayout } from "~/components/training-layout";
import { db } from "~/database/db.server";
import { others } from "~/database/schema.server";
import { http } from "~/lib/http-responses";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id!;

  const other = await db.query.others.findFirst({ where: eq(others.id, id) });
  if (!other) {
    throw http.notFound({ message: "Expression not found" });
  }

  return json({ other });
}

export default function Other() {
  const { other } = useLoaderData<typeof loader>();
  const { id } = useParams();

  return (
    <TrainingLayout
      editPath={`/enrich/other?edit=${id}`}
      nextPath={`/other/${id}/answer`}
      stage="question"
    >
      <span className="text-3xl text-center">{other.french}</span>
    </TrainingLayout>
  );
}
