import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import RevisionLayout from "~/components/revision-layout";
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

  return (
    <RevisionLayout nextPath={`/random`}>
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
    </RevisionLayout>
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
