import Image from "next/image";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import hedearStyles from "./header.module.scss";

import { SidePanel } from ".";
import { svg } from "./utils";
import {
  AppDispatch,
  RootState,
  addNotifications,
  fetchAuthToken,
} from "./stores";

// for more info on extend refer the https://stackoverflow.com/a/57706747/5720826 comment
// It's better to extend unknown, or to simply put the hook in a .ts file. If you extend {} you will get errors if you skip specifying T in usePrevious<T>
const usePrevious = <T extends any>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuthError = useSelector(
    (state: RootState) => state.root.user.error,
  );

  const prevUserAuthError = usePrevious(userAuthError);

  useEffect(() => {
    if (prevUserAuthError) {
      if (
        userAuthError &&
        userAuthError.message !== prevUserAuthError.message
      ) {
        const { message } = userAuthError;
        dispatch(addNotifications(message));
      }
    } else {
      if (userAuthError && userAuthError.message) {
        const { message } = userAuthError;
        dispatch(addNotifications(message));
      }
    }
  }, [userAuthError]);

  useEffect(() => {
    const begin = async () => {
      dispatch(fetchAuthToken());
    };

    begin();
  }, []);

  return (
    <header className={hedearStyles["app-main-header"]}>
      <section>
        <Image
          alt="app logo"
          src={svg.logo}
          className={hedearStyles["app-logo"]}
        ></Image>
      </section>
      <section>
        <SidePanel />
      </section>
    </header>
  );
};
