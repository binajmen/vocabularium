import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import z from "zod";
import { Field } from "~/components/field";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const schema = z.object({
  singular: z.string(),
  plural: z.string(),
  french: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  return json(submission);
}

export default function Enrich() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { singular, plural, french }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

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
      <Button type="submit">Submit</Button>
      {form.error && <Alert variant="destructive">{form.error}</Alert>}
    </Form>
  );
}
