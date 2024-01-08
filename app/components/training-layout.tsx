import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { HomeIcon } from "@radix-ui/react-icons";

export default function TrainingLayout(props: {
  nextPath: string;
  children: JSX.Element;
}) {
  return (
    <div className="grid grid-rows-[1fr_auto] h-full bg-gray-800 p-4 gap-4">
      <div className="bg-gray-100 rounded-md p-4 flex justify-center items-center">
        {props.children}
      </div>
      <div className="flex justify-between">
        <Button asChild variant="link">
          <Link to="/" prefetch="render">
            <HomeIcon />
          </Link>
        </Button>
        <Button asChild>
          <Link to={props.nextPath} prefetch="render">
            Voir la réponse
          </Link>
        </Button>
      </div>
    </div>
  );
}
