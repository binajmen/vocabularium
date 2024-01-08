import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import z from "zod";
import { Field } from "~/components/field";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { db } from "~/database/db.server";
import { nouns } from "~/database/schema.server";
import { cn } from "~/lib/utils";

const schema = z.object({
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
  terms: z.string().refine((value) => value === "on"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ submission, success: false });
  }

  await db.insert(nouns).values(submission.value);

  return json({ submission, success: true });
}

export default function Enrich() {
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();
  const [form, { singular, plural, french, terms }] = useForm({
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  // TOFIX: there's probably a better way to handle this?
  useEffect(() => {
    if (actionData?.success) {
      form.ref.current?.reset();
      toast({
        title: "Success!",
        description: "The noun has been added to the database",
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
        <Checkbox id={terms.name} name={terms.name} />
        <label
          htmlFor={terms.name}
          className={cn("text-xs", terms.errors && "text-red-700")}
        >
          I confirm the accuracy of my submission.
        </label>
      </div>
      <Button type="submit">Submit</Button>
      {form.error && <Alert variant="destructive">{form.error}</Alert>}
    </Form>
  );
}
