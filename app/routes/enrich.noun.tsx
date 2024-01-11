import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { UploadIcon } from "@radix-ui/react-icons";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import z from "zod";
import { Field } from "~/components/field";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { db } from "~/database/db.server";
import { lexicon, nouns } from "~/database/schema.server";
import { requireAuthCookie } from "~/lib/auth.server";
import { http } from "~/lib/http-responses";
import { cn } from "~/lib/utils";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("edit");

  if (id) {
    const noun = await db.query.nouns.findFirst({ where: eq(nouns.id, id) });
    if (!noun) {
      throw http.notFound({ message: "Not found" });
    }
    return json({ noun });
  }

  return json({ noun: null });
}

const dataSchema = z.object({
  singular: z
    .string()
    .refine(
      (value) =>
        value.startsWith("der") ||
        value.startsWith("die") ||
        value.startsWith("das"),
      'Must start with "der", "die" or "das"'
    ),
  plural: z.string(),
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
  const userId = await requireAuthCookie(request);
  const formData = await request.formData();
  const submission = await parse(formData, { schema: intentSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return http.badRequest({ submission, id: null, success: false });
  }

  switch (submission.value.intent) {
    case "submit": {
      try {
        const { intent, confirm, ...values } = submission.value;
        const noun = await db.transaction(async (tx) => {
          const noun = await tx.insert(nouns).values(values).returning();

          await tx.insert(lexicon).values({
            id: noun[0].id,
            type: "noun",
            userId,
          });

          return noun;
        });
        return json({ submission, id: noun[0].id, success: true });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.startsWith("duplicate key")
        ) {
          return http.badRequest({
            submission: {
              ...submission,
              error: {
                singular: ["This noun already exists in the database"],
              },
            },
            id: null,
            success: false,
          });
        }
        throw error;
      }
    }
    case "update": {
      const { intent, id, confirm, ...values } = submission.value;
      await db.update(nouns).set(values).where(eq(nouns.id, id));
      return redirect(`/noun/${submission.value.id}/question`);
    }
  }
}

export default function Enrich() {
  const { noun } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();
  const [form, { singular, plural, french, confirm }] = useForm({
    defaultValue: noun || undefined,
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: dataSchema });
    },
  });

  useEffect(() => {
    if (actionData?.success) {
      form.ref.current?.reset();
      toast({
        title: "Success!",
        description: "The noun has been added to the database",
        action: (
          <ToastAction altText="View">
            <Link to={`/noun/${actionData.id}/question`}>View</Link>
          </ToastAction>
        ),
      });
    }
  }, [actionData]);

  return (
    <Form method="post" className="p-1 space-y-4" {...form.props}>
      <Field
        name={singular.name}
        label="Singular"
        description="Singular form of the noun"
        error={singular.error}
      >
        <Input placeholder="eg: das Buch" {...conform.input(singular)} />
      </Field>
      <Field
        name={plural.name}
        label="Plural"
        description="Plural form of the noun"
        error={plural.error}
      >
        <Input placeholder="eg: die Bücher" {...conform.input(plural)} />
      </Field>
      <Field
        name={french.name}
        label="French"
        description="French translation"
        error={french.error}
      >
        <Input placeholder="eg: Le livre" {...conform.input(french)} />
      </Field>
      <div className="flex items-center gap-2">
        <Checkbox id={confirm.name} name={confirm.name} />
        <label
          htmlFor={confirm.name}
          className={cn("text-xs", confirm.error && "text-red-700")}
        >
          I confirm the accuracy of my submission.
        </label>
      </div>
      {noun && <input type="hidden" name="id" value={noun.id} />}
      <Button type="submit" name="intent" value={noun ? "update" : "submit"}>
        <UploadIcon />
        {noun ? "Update" : "Submit"}
      </Button>
      {form.error && <Alert variant="destructive">{form.error}</Alert>}
    </Form>
  );
}
