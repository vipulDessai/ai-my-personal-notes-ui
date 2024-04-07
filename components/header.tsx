import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gql, useMutation } from "@apollo/client";

import hedearStyles from "./header.module.scss";

import { SidePanel } from ".";
import { GENERAL_KEYS, GetUserAuthData, errorHandler, svg } from "./utils";
import {
  AppDispatch,
  addNotifications,
  setUserDataError,
  setUserIsLoading,
} from "./stores";

const GET_AUTH_TOKEN = gql`
  mutation getToken($email: String!, $pwd: String!) {
    token(email: $email, password: $pwd)
  }
`;

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [getUserAuthToken, { data: authTokenData, loading, error }] =
    useMutation<GetUserAuthData>(GET_AUTH_TOKEN);

  useEffect(() => {
    if (loading) {
      dispatch(setUserIsLoading({ value: true }));
    } else {
      dispatch(setUserIsLoading({ value: false }));
      if (authTokenData) {
        localStorage.setItem(GENERAL_KEYS.APP_API_TOKEN, authTokenData.token);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      const { message } = errorHandler(error);
      // component level error notification
      dispatch(setUserDataError({ value: message }));
      // global notification too
      dispatch(addNotifications(message));
    }
  }, [error]);

  useEffect(() => {
    const begin = async () => {
      const userAppAuthToken = localStorage.getItem(GENERAL_KEYS.APP_API_TOKEN);
      if (!userAppAuthToken) {
        // TODO: if the graphQl call fails, then it throws error here
        // so handle it 😅
        getUserAuthToken({
          variables: {
            email: process.env.NEXT_PUBLIC_API_USER_ID,
            pwd: process.env.NEXT_PUBLIC_API_USER_PWD,
          },
        });
      }
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
