import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Alert } from "./ui/alert";

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="p-4">
      {isRouteErrorResponse(error) ? (
        <Alert variant="destructive">{error.data.message}</Alert>
      ) : (
        <Alert variant="destructive">Unknown error</Alert>
      )}
    </div>
  );
}
