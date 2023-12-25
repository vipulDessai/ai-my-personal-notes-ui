import Image from "next/image";

import commonStyles from "../styles/common.module.scss";

import { svg } from "./utils/icons";

export const Footer = () => {
  return (
    <footer>
      <a
        className={commonStyles["flex-center"]}
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Powered by</span>
        <Image
          src={svg.vercelLogo}
          alt="Vercel"
          className={commonStyles.logo}
        />
      </a>
    </footer>
  );
};
