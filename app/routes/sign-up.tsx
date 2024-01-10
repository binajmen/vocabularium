import { parse } from "@conform-to/zod";
import { PlusCircledIcon, RocketIcon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/lib/auth.server";
import { http } from "~/lib/http-responses";
import crypto from "crypto";
import { db } from "~/database/db.server";
import { eq } from "drizzle-orm";
import { users } from "~/database/schema.server";
import { conform, useForm } from "@conform-to/react";
import { Field } from "~/components/field";
import { Input } from "~/components/ui/input";

export const loader = redirectIfLoggedInLoader;

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, {
    schema: loginSchema.superRefine(async (values, ctx) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, values.email),
      });
      if (user) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Email already exists",
        });
      }
    }),
    async: true,
  });

  if (submission.intent !== "submit" || !submission.value) {
    return http.badRequest({ submission, success: false });
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(submission.value.password, salt, 1000, 64, "sha256")
    .toString("hex");

  const user = await db
    .insert(users)
    .values({ ...submission.value, salt, password: hash })
    .returning();

  return setAuthOnResponse(redirect("/"), user[0].id);
}

export default function SignIn() {
  const actionData = useActionData<typeof action>();
  const [form, { email, password, name }] = useForm({
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: loginSchema });
    },
  });

  return (
    <div className="flex items-center flex-col h-full p-8">
      <h1 className="text-3xl">Sign up</h1>
      <Form
        method="post"
        className="flex flex-col gap-8 flex-1 justify-center h-full"
        {...form.props}
      >
        <Field name={email.name} label="Email" error={email.error}>
          <Input {...conform.input(email)} />
        </Field>
        <Field name={password.name} label="Password" error={password.error}>
          <Input type="password" {...conform.input(password)} />
        </Field>
        <Field name={name.name} label="Name" error={name.error}>
          <Input {...conform.input(name)} />
        </Field>
        <Button type="submit" name="intent" value="sign-in">
          Sign up
        </Button>
      </Form>
    </div>
  );
}
