import { Pencil2Icon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { db } from "~/database/db.server";
import { nouns } from "~/database/schema.server";
import { cn } from "~/lib/utils";

export async function loader() {
  const allNouns = await db.query.nouns.findMany({ orderBy: [nouns.french] });
  return json({ nouns: allNouns });
}

export default function StudyNoun() {
  const { nouns } = useLoaderData<typeof loader>();

  return (
    <table className="w-full">
      <thead className="sticky top-0 bg-white font-bold">
        <tr>
          <td>French</td>
          <td>Singular</td>
          <td>Plural</td>
          <td />
        </tr>
      </thead>
      <tbody>
        {nouns.map((noun) => (
          <Row key={noun.id}>
            <td className="align-middle flex items-center">
              {noun.french}
              <Button variant="ghost" asChild>
                <Link
                  to={`/enrich/noun?edit=${noun.id}`}
                  className="inline-flex items-center gap-2"
                >
                  <Pencil2Icon />
                </Link>
              </Button>
            </td>
            <td>{noun.singular}</td>
            <td>{noun.plural}</td>
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
