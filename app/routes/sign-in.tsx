import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { Field } from "~/components/field";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { db } from "~/database/db.server";
import { users } from "~/database/schema.server";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/lib/auth.server";
import { http } from "~/lib/http-responses";

export const loader = redirectIfLoggedInLoader;

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, { schema: loginSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return http.badRequest({ submission, success: false });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, submission.value.email),
  });
  if (!user) {
    return http.badRequest({
      submission: { ...submission, error: { email: ["Invalid credentials"] } },
      success: false,
    });
  }

  const hash = crypto
    .pbkdf2Sync(submission.value.password, user.salt, 1000, 64, "sha256")
    .toString("hex");
  if (hash !== user.password) {
    return http.badRequest({
      submission: {
        ...submission,
        error: { password: ["Invalid credentials"] },
      },
      success: false,
    });
  }

  return setAuthOnResponse(redirect("/"), user.id);
}

export default function SignIn() {
  const actionData = useActionData<typeof action>();
  const [form, { email, password }] = useForm({
    lastSubmission: actionData?.submission,
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: loginSchema });
    },
  });

  return (
    <div className="flex items-center flex-col h-full p-8">
      <h1 className="text-3xl">Sign-in</h1>
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
        <Button type="submit" name="intent" value="sign-in">
          Sign in
        </Button>
      </Form>
    </div>
  );
}
