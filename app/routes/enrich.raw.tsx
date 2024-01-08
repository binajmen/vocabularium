import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import z from "zod";
import { Field } from "~/components/field";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { db } from "~/database/db.server";
import {
  nouns,
  others,
  verbs,
  type Noun,
  type Other,
  type Verb,
} from "~/database/schema.server";

type Term =
  | ({ type: "noun" } & Omit<Noun, "id">)
  | ({ type: "verb" } & Omit<Verb, "id">)
  | ({ type: "other" } & Omit<Other, "id">);

const schema = z.object({
  raw: z.string().transform((input, ctx) => {
    const lines = input.split("\n");
    const terms: Term[] = [];

    for (let i = 0; i < lines.length; i++) {
      const [type, ...values] = lines[i].split(";");

      switch (type) {
        case "noun": {
          // name;das Alphabet;die Alphabete;L'alphabet
          if (values.length !== 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Wront format (name at line ${i})`,
            });
            return z.NEVER;
          }
          const [singular, plural, french] = values;
          terms.push({ type, singular, plural, french });
          break;
        }
        case "verb": {
          // verb;buchstabieren;épeler;buchstabiere;buchstabierst;buchstabiert;buchstabiere
          if (values.length !== 8) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Wront format (verb at line ${i})`,
            });
            return z.NEVER;
          }
          const [infinitive, french, ...present] = values;
          terms.push({
            type,
            infinitive,
            present: {
              s1: present[0],
              s2: present[1],
              s3: present[2],
              p1: present[3],
              p2: present[4],
              p3: present[5],
            },
            french,
          });
          break;
        }
        case "other":
          // other;Danke;Merci
          if (values.length !== 2) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Wront format (other at line ${i})`,
            });
            return z.NEVER;
          }
          const [expression, french] = values;
          terms.push({ type, expression, french });
          break;
        default: {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Wront format (unknown type at line ${i})`,
          });
          return z.NEVER;
        }
      }
    }

    return terms;
  }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  const { raw } = submission.value;

  console.log(`received ${raw.length} terms`);
  for (const term of raw) {
    console.log(" ..");
    try {
      switch (term.type) {
        case "noun": {
          const { type, ...values } = term;
          await db.insert(nouns).values(values);
          break;
        }
        case "verb": {
          const { type, ...values } = term;
          await db.insert(verbs).values(values);
          break;
        }
        case "other": {
          const { type, ...values } = term;
          await db.insert(others).values(values);
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  console.log("done!");

  return json(submission);
}

export default function Enrich() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { raw }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  return (
    <Form method="post" className="p-1 space-y-2" {...form.props}>
      <Field
        name={raw.name}
        label="Raw input"
        description="Expression, adjective, adverb, etc."
        error={raw.error}
      >
        <Textarea rows={15} {...conform.input(raw)}></Textarea>
      </Field>
      <Button type="submit">Submit</Button>
      {form.error && <Alert variant="destructive">{form.error}</Alert>}
    </Form>
  );
}
