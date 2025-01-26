import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
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

import "./styles/global.css";

import { globalStore, persistedGlobalStore } from "./components/stores";
import { CommonFeedbackComponents } from "./components";
import { apiConnector } from "./components/utils";

import Home from "./pages/Home";
import AddNote from "./pages/AddNote/AddNote";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ApolloProvider client={apiConnector}>
          <Provider store={globalStore}>
            <PersistGate loading={null} persistor={persistedGlobalStore}>
              <Suspense fallback={<div>Loading...</div>}>
                {" "}
                {/* Loading indicator */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/add-note" element={<AddNote />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <CommonFeedbackComponents />
            </PersistGate>
          </Provider>
        </ApolloProvider>
      </LocalizationProvider>
    </BrowserRouter>
  );
}
