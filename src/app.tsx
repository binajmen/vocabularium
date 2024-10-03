// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "@fontsource-variable/jetbrains-mono";
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";

export default function App() {
  return (
    <MetaProvider>
      <Title>Vocabularium</Title>
      <Router
        root={(props) => (
          <>
            <a href="/">Index</a>
            <a href="/about">About</a>
            <Suspense>{props.children}</Suspense>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
