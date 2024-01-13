import { Pencil2Icon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { db } from "~/database/db.server";
import { verbs } from "~/database/schema.server";
import { cn } from "~/lib/utils";

export async function loader() {
  const allVerbs = await db.query.verbs.findMany({ orderBy: [verbs.french] });
  return json({ verbs: allVerbs });
}

export default function StudyNoun() {
  const { verbs } = useLoaderData<typeof loader>();

  return (
    <table className="w-full">
      <thead className="sticky top-0 bg-white font-bold">
        <tr>
          <td>French</td>
          <td>Infinitive</td>
          <td />
          <td />
          <td />
          <td />
        </tr>
      </thead>
      <tbody>
        {verbs.map((verb) => (
          <Row key={verb.id}>
            <td className="align-middle flex items-center">
              {verb.french}
              <Button variant="ghost" asChild>
                <Link
                  to={`/enrich/verb?edit=${verb.id}`}
                  className="inline-flex items-center gap-2"
                >
                  <Pencil2Icon />
                </Link>
              </Button>
            </td>
            <td>{verb.infinitive}</td>
            <td>du {verb.present.s2}</td>
            <td>er {verb.present.s3}</td>
            <td>ihr {verb.present.p2}</td>
          </Row>
        ))}
      </tbody>
    </table>
  );
}

function Row(props: { children: JSX.Element[] }) {
  const [known, setKnown] = useState<boolean | null>(null);

  return (
    <tr
      className={cn(
        "border-b",
        known === true && "bg-green-50",
        known === false && "bg-red-50"
      )}
    >
      {props.children}
      <td>
        <Button variant="ghost" onClick={() => setKnown(false)}>
          👎
        </Button>
        <Button variant="ghost" onClick={() => setKnown(true)}>
          👍
        </Button>
      </td>
    </tr>
  );
}
