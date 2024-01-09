import {
  ArrowRightIcon,
  EyeOpenIcon,
  HomeIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export function TrainingLayout(props: {
  editPath: string;
  nextPath: string;
  children: JSX.Element;
  stage: "question" | "answer";
}) {
  return (
    <div className="grid grid-rows-[1fr_auto] h-full bg-gray-800 p-4 gap-4">
      <div className="relative bg-gray-50 rounded-md p-4 flex justify-center items-center">
        <Button variant="ghost" className="absolute top-4 right-4" asChild>
          <Link to={props.editPath} className="inline-flex items-center gap-2">
            <Pencil2Icon />
          </Link>
        </Button>
        {props.children}
      </div>
      <div className="flex justify-between">
        <Button asChild variant="link">
          <Link to="/" prefetch="render">
            <HomeIcon />
          </Link>
        </Button>
        <Button asChild>
          <Link
            to={props.nextPath}
            prefetch="render"
            className="inline-flex items-center gap-2"
          >
            {props.stage === "question" ? (
              <>
                <EyeOpenIcon />
                Show
              </>
            ) : (
              <>
                Continue
                <ArrowRightIcon />
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
