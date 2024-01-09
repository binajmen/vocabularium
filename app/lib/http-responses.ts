import { json } from "@remix-run/node";
export * as http from "~/lib/http-responses";

export const badRequest: typeof json = (data, init) => {
  return json(
    data,
    typeof init === "object" ? { ...init, status: 400 } : { status: 400 }
  );
};

export const unauthorized: typeof json = (data, init) => {
  return json(
    data,
    typeof init === "object" ? { ...init, status: 401 } : { status: 401 }
  );
};

export const forbidden: typeof json = (data, init) => {
  return json(
    data,
    typeof init === "object" ? { ...init, status: 403 } : { status: 403 }
  );
};

export const notFound: typeof json = (data, init) => {
  return json(
    data,
    typeof init === "object" ? { ...init, status: 404 } : { status: 404 }
  );
};
