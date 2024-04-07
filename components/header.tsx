import Image from "next/image";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";

import hedearStyles from "./header.module.scss";

import { SidePanel } from ".";
import { GENERAL_KEYS, GetUserAuthData, errorHandler, svg } from "./utils";
import {
  AppDispatch,
  RootState,
  addNotifications,
  fetchAuthToken,
  hideLoader,
  setError,
  showLoader,
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

const GET_AUTH_TOKEN = gql`
  mutation getToken($email: String!, $pwd: String!) {
    token(email: $email, password: $pwd)
  }
`;

export const Header = () => {
  const [getUserAuthToken, { data: authTokenData, loading, error }] =
    useMutation<GetUserAuthData>(GET_AUTH_TOKEN);

  useEffect(() => {
    if (loading) dispatch(showLoader());
    else {
      dispatch(hideLoader());
      if (authTokenData)
        localStorage.setItem(GENERAL_KEYS.APP_API_TOKEN, authTokenData.token);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      dispatch(setError(errorHandler(error)));
    }
  }, [error]);

  const dispatch = useDispatch<AppDispatch>();

  // TODO: add the user slice back, once the apollo client and local storage retain
  // issue is fixed
  // const userAuthError = useSelector(
  //   (state: RootState) => state.root.user.error,
  // );
  // const prevUserAuthError = usePrevious(userAuthError);
  // useEffect(() => {
  //   if (prevUserAuthError) {
  //     if (
  //       userAuthError &&
  //       userAuthError.message !== prevUserAuthError.message
  //     ) {
  //       const { message } = userAuthError;
  //       dispatch(addNotifications(message));
  //     }
  //   } else {
  //     if (userAuthError && userAuthError.message) {
  //       const { message } = userAuthError;
  //       dispatch(addNotifications(message));
  //     }
  //   }
  // }, [userAuthError]);

  useEffect(() => {
    const begin = async () => {
      getUserAuthToken({
        variables: {
          email: process.env.NEXT_PUBLIC_API_USER_ID,
          pwd: process.env.NEXT_PUBLIC_API_USER_PWD,
        },
      });

      // TODO: cache the user data using either redux or apollo
      // dispatch(fetchAuthToken());
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
