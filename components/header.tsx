import Image from "next/image";

import hedearStyles from "./header.module.scss";

import { SidePanel, svg } from ".";

export const Header = () => {
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
