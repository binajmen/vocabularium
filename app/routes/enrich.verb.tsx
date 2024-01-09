import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { UploadIcon } from "@radix-ui/react-icons";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
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
import { verbs } from "~/database/schema.server";
import { http } from "~/lib/http-responses";
import { cn } from "~/lib/utils";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("edit");

  if (id) {
    const verb = await db.query.verbs.findFirst({ where: eq(verbs.id, id) });
    if (!verb) {
      throw http.notFound({ message: "Not found" });
    }
    return json({ verb });
  }

  return json({ verb: null });
}

const dataSchema = z.object({
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
    return http.badRequest({ submission, success: false });
  }

  switch (submission.value.intent) {
    case "submit": {
      try {
        const { intent, infinitive, french, confirm, ...present } =
          submission.value;
        await db.insert(verbs).values({ infinitive, french, present });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.startsWith("duplicate key")
        ) {
          return http.badRequest({
            submission: {
              ...submission,
              error: {
                infinitive: ["This verb already exists in the database"],
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
      const { intent, id, infinitive, french, confirm, ...present } =
        submission.value;
      await db
        .update(verbs)
        .set({ infinitive, french, present })
        .where(eq(verbs.id, id));
      return redirect(`/verb/${submission.value.id}/question`);
    }
  }

  return json({ submission, success: true });
}

export default function Enrich() {
  const { verb } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();
  const [form, { infinitive, french, s1, s2, s3, p1, p2, p3, confirm }] =
    useForm({
      defaultValue: verb
        ? {
            ...verb,
            s1: verb.present.s1,
            s2: verb.present.s2,
            s3: verb.present.s3,
            p1: verb.present.p1,
            p2: verb.present.p2,
            p3: verb.present.p3,
          }
        : undefined,
      lastSubmission: actionData?.submission,
      shouldValidate: "onBlur",
      onValidate({ formData }) {
        return parse(formData, { schema: dataSchema });
      },
    });

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
        <Input placeholder="eg: être" {...conform.input(french)} />
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
      {verb && <input type="hidden" name="id" value={verb.id} />}
      <Button type="submit" name="intent" value={verb ? "update" : "submit"}>
        <UploadIcon />
        {verb ? "Update" : "Submit"}
      </Button>
      {form.error && <Alert variant="destructive">{form.error}</Alert>}
    </Form>
  );
}
