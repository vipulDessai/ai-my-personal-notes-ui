import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import hedearStyles from "./header.module.scss";

import { SidePanel } from ".";
import { svg } from "./utils";
import { AppDispatch, fetchAuthToken } from "./stores";

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

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
