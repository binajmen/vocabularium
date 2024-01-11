import {
  ArrowRightIcon,
  CheckIcon,
  Cross2Icon,
  EyeOpenIcon,
  HomeIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { Form, Link, useParams } from "@remix-run/react";
import { Button } from "./ui/button";
import { useUserOrNull } from "~/hooks/use-root-data";

export function TrainingLayout(props: {
  editPath: string;
  nextPath: string;
  children: JSX.Element;
  stage: "question" | "answer";
}) {
  const id = useParams().id!;
  const userId = useUserOrNull();

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
        {userId && props.stage === "answer" ? (
          <Form
            method="get"
            action="/score"
            className="flex items-center gap-3"
          >
            <input type="hidden" name="id" value={id} />
            <Button className="relative" variant="red" name="grade" value="1">
              <span className="text-xs">Retry</span>
              <span className="absolute -top-2">😢</span>
            </Button>
            <Button
              className="relative"
              variant="yellow"
              name="grade"
              value="3"
            >
              <span className="text-xs">Difficult</span>
              <span className="absolute -top-2">😓</span>
            </Button>
            <Button className="relative" variant="green" name="grade" value="5">
              <span className="text-xs">Easy</span>
              <span className="absolute -top-2">🥳</span>
            </Button>
          </Form>
        ) : (
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
        )}
      </div>
    </div>
  );
}
