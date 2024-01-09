import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { UploadIcon } from "@radix-ui/react-icons";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import z from "zod";
import { Field } from "~/components/field";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { db } from "~/database/db.server";
import { others } from "~/database/schema.server";
import { http } from "~/lib/http-responses";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("edit");

  if (id) {
    const other = await db.query.others.findFirst({ where: eq(others.id, id) });
    if (!other) {
      throw http.notFound({ message: "Not found" });
    }
    return json({ other });
  }

  return json({ other: null });
}

const dataSchema = z.object({
  expression: z.string(),
  french: z.string(),
  confirm: z.string().refine((value) => value === "on"),
});

const intentSchema = z.discriminatedUnion("intent", [
  z
    .object({
      intent: z.literal("submit"),
    })
    .merge(dataSchema),
  z
    .object({
      intent: z.literal("update"),
      id: z.string(),
    })
    .merge(dataSchema),
]);

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, { schema: intentSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ submission, success: false });
  }

  switch (submission.value.intent) {
    case "submit": {
      try {
        await db.insert(others).values(submission.value);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.startsWith("duplicate key")
        ) {
          return json({
            submission: {
              ...submission,
              error: {
                expression: ["This expression already exists in the database"],
              },
            },
            success: false,
          });
        }
        throw error;
      }
      break;
    }
    case "update": {
      const { intent, id, confirm, ...values } = submission.value;
      await db.update(others).set(values).where(eq(others.id, id));
      return redirect(`/other/${submission.value.id}/question`);
    }
  }

  return json({ submission, success: true });
}

export default function Enrich() {
  const { other } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();
  const [form, { expression, french, confirm }] = useForm({
    defaultValue: other || undefined,
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: intentSchema });
    },
  });

  // TOFIX: there's probably a better way to handle this?
  useEffect(() => {
    if (actionData?.success) {
      form.ref.current?.reset();
      toast({
        title: "Success!",
        description: "The expression has been added to the database",
      });
    }
  }, [actionData]);

  return (
    <Form method="post" className="p-1 space-y-4" {...form.props}>
      {other && <input type="hidden" name="id" value={other.id} />}
      <Field
        name={expression.name}
        label="Expression"
        description="Expression, adjective, adverb, etc."
        error={expression.error}
      >
        <Input placeholder="eg: Danke schön!" {...conform.input(expression)} />
      </Field>
      <Field
        name={french.name}
        label="French"
        description="French translation"
        error={french.error}
      >
        <Input placeholder="eg: Merci beaucoup !" {...conform.input(french)} />
      </Field>
      <div className="flex items-center gap-2">
        <Checkbox id={confirm.name} name={confirm.name} />
        <label
          htmlFor={confirm.name}
          className={cn("text-xs", confirm.errors && "text-red-700")}
        >
          I confirm the accuracy of my submission.
        </label>
      </div>
      <Button type="submit" name="intent" value={other ? "update" : "submit"}>
        <UploadIcon />
        {other ? "Update" : "Submit"}
      </Button>
      {form.error && <Alert variant="destructive">{form.error}</Alert>}
    </Form>
  );
}
