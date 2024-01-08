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
import { verbs } from "~/database/schema.server";
import { cn } from "~/lib/utils";

const schema = z.object({
  infinitive: z.string(),
  french: z.string(),
  s1: z.string(),
  s2: z.string(),
  s3: z.string(),
  p1: z.string(),
  p2: z.string(),
  p3: z.string(),
  confirm: z.string().refine((value) => value === "on"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, {
    schema: schema.superRefine(async (values, ctx) => {
      const alreadyExists = await db.query.verbs.findFirst({
        where: eq(verbs.infinitive, values.infinitive),
      });
      if (alreadyExists) {
        ctx.addIssue({
          path: ["infinitive"],
          code: z.ZodIssueCode.custom,
          message: `This verb already exists in the database`,
        });
      }
    }),
    async: true,
  });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ submission, success: false });
  }

  const { infinitive, french, ...present } = submission.value;
  await db.insert(verbs).values({ infinitive, french, present });

  return json({ submission, success: true });
}

export default function Enrich() {
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();
  const [form, { infinitive, french, s1, s2, s3, p1, p2, p3, confirm }] =
    useForm({
      lastSubmission: actionData?.submission,
      shouldValidate: "onBlur",
      onValidate({ formData }) {
        return parse(formData, { schema });
      },
    });

  console.log({ s1 });

  // TOFIX: there's probably a better way to handle this?
  useEffect(() => {
    if (actionData?.success) {
      form.ref.current?.reset();
      toast({
        title: "Success!",
        description: "The verb has been added to the database",
      });
    }
  }, [actionData]);

  return (
    <Form method="post" className="p-1 space-y-4" {...form.props}>
      <Field
        name={infinitive.name}
        label="Infinitive"
        description="Infinitive form of the verb"
        error={infinitive.error}
      >
        <Input placeholder="eg: sein" {...conform.input(infinitive)} />
      </Field>
      <Field
        name={french.name}
        label="French"
        description="French translation"
        error={french.error}
      >
        <Input placeholder="eg: Le livre" {...conform.input(french)} />
      </Field>
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <label className="text-sm">ich</label>
        <Input
          placeholder="bin"
          className={cn(s1.error && "border-red-700")}
          {...conform.input(s1)}
        />
        <label className="text-sm">du</label>
        <Input
          placeholder="bist"
          className={cn(s2.error && "border-red-700")}
          {...conform.input(s2)}
        />
        <label className="text-sm">er/sie/es</label>
        <Input
          placeholder="ist"
          className={cn(s3.error && "border-red-700")}
          {...conform.input(s3)}
        />
        <label className="text-sm">wir</label>
        <Input
          placeholder="sind"
          className={cn(p1.error && "border-red-700")}
          {...conform.input(p1)}
        />
        <label className="text-sm">ihr</label>
        <Input
          placeholder="seid"
          className={cn(p2.error && "border-red-700")}
          {...conform.input(p2)}
        />
        <label className="text-sm">sie/Sie</label>
        <Input
          placeholder="sind"
          className={cn(p3.error && "border-red-700")}
          {...conform.input(p3)}
        />
      </div>
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
