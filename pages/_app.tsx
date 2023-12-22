import { initializeIcons } from "@fluentui/react/lib/Icons";

import "../styles/global.scss";

initializeIcons(/* optional base url */);

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
