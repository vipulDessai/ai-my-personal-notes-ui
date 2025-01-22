import React, { Suspense, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/_app";

function Foo({}) {
  return <section>Foo</section>;
}

// use the dynamic import for faster app loading in the browser
async function begin() {
  // #root is core of the application, it will be always available
  const root = createRoot(document.getElementById("root") as HTMLElement);

  // TODO: Add strictmode here
  root.render(
    <StrictMode>
      <App Component={Foo} pageProps={{}} />
    </StrictMode>,
  );
}

begin();

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(); // Accept updates for the current module
}
