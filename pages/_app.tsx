import { Provider } from "react-redux";

// dependency for material ui plugin
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "../styles/global.scss";

import { globalStore } from "../components/stores";
import { CommonFeedbackComponents } from "../components";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={globalStore}>
      <Component {...pageProps} />
      <CommonFeedbackComponents />
    </Provider>
  );
}
