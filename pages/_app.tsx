import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ApolloProvider } from "@apollo/client";

// dependency for material ui plugin
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "../styles/global.scss";

import { globalStore, persistedGlobalStore } from "../components/stores";
import { CommonFeedbackComponents } from "../components";
import { apiConnector } from "../components/utils";

export default function App({ Component, pageProps }) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ApolloProvider client={apiConnector}>
        <Provider store={globalStore}>
          <PersistGate loading={null} persistor={persistedGlobalStore}>
            <Component {...pageProps} />
            <CommonFeedbackComponents />
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </LocalizationProvider>
  );
}
