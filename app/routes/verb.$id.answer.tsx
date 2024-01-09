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
    throw http.notFound({ message: "Verb not found" });
  }

  return json({ verb });
}

export default function Verb() {
  const { verb } = useLoaderData<typeof loader>();
  const { id } = useParams();

  return (
    <TrainingLayout
      editPath={`/enrich/verb/${id}`}
      nextPath={`/random`}
      stage="answer"
    >
      <div className="flex justify-center items-center flex-col">
        <span className="text-3xl mb-8">{verb.infinitive}</span>
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 text-xl">
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
    </TrainingLayout>
  );
}
