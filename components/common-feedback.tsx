import { useDispatch, useSelector } from "react-redux";
import { Alert, AlertTitle, Backdrop, CircularProgress } from "@mui/material";

import commonFeedback from "./common-feedback.module.scss";

import { AppDispatch, RootState } from "./stores";
import { resetAlert } from "./stores/features/alert.slice";

export const CommonFeedbackComponents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showLoader = useSelector((state: RootState) => state.root.loader);
  const alertData = useSelector((state: RootState) => state.root.alert);

  return (
    <>
      {showLoader.loadingInProgress && (
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
    </>
  );
};
