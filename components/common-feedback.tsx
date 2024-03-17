import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  AlertTitle,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";

import commonFeedback from "./common-feedback.module.scss";

import {
  AppDispatch,
  RootState,
  removeNotifications,
  resetAlert,
} from "./stores";

export const CommonFeedbackComponents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showLoader = useSelector(
    (state: RootState) => state.root.appFeed.loadingInProgress,
  );
  const alertData = useSelector((state: RootState) => state.root.appFeed.alert);
  const snackBarNotifications = useSelector(
    (state: RootState) => state.root.appFeed.notifications,
  );

  return (
    <>
      {showLoader && (
        <section className={commonFeedback["common-progress"]}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </section>
      )}
      {alertData.message && (
        <section className={commonFeedback["common-alert"]}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            onClick={() => {
              dispatch(resetAlert());
            }}
          >
            <Alert severity={alertData.type}>
              <AlertTitle>{alertData.title}</AlertTitle>
              {alertData.message}
            </Alert>
          </Backdrop>
        </section>
      )}
      {snackBarNotifications.length > 0 &&
        snackBarNotifications.map((s, i) => (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={true}
            onClose={() => dispatch(removeNotifications({ index: i }))}
            message={s}
            key={i}
          />
        ))}
    </>
  );
};
