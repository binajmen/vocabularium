import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
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
import { cn } from "~/lib/utils";

const schema = z.object({
  expression: z.string(),
  french: z.string(),
  confirm: z.string().refine((value) => value === "on"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, {
    schema: schema.superRefine(async (values, ctx) => {
      const alreadyExists = await db.query.others.findFirst({
        where: eq(others.expression, values.expression),
      });
      if (alreadyExists) {
        ctx.addIssue({
          path: ["expression"],
          code: z.ZodIssueCode.custom,
          message: `This expression already exists in the database`,
        });
      }
    }),
    async: true,
  });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ submission, success: false });
  }

  await db.insert(others).values(submission.value);

  return json({ submission, success: true });
}

export default function Enrich() {
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();
  const [form, { expression, french, confirm }] = useForm({
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
        description: "The expression has been added to the database",
      });
    }
  }, [actionData]);

  return (
    <Form method="post" className="p-1 space-y-4" {...form.props}>
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
      <Button type="submit">Submit</Button>
      {form.error && <Alert variant="destructive">{form.error}</Alert>}
    </Form>
  );
}
