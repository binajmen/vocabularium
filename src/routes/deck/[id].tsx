import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { getDeckWithCards } from "~/api";

export const route = {
  preload: ({ params }) => getDeckWithCards(params.id),
} satisfies RouteDefinition;

export default function DeckId() {
  const params = useParams();
  const deck = createAsync(() => getDeckWithCards(params.id));

  return (
    <>
      whoop whoop
      <pre>{JSON.stringify(deck(), null, 2)}</pre>
    </>
  );
}
