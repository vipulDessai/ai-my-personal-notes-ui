import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import commonStyles from "../styles/common.module.scss";

import logoSvg from "../public/note-manager-app-main-logo.svg";

export default function Home() {
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Image
          alt="Follow us on Twitter"
          src={logoSvg}
          className={commonStyles["app-logo"]}
        ></Image>
      </header>

      <nav>
        <ul>
          <li>
            <Link href="/add">Add Note</Link>
          </li>
        </ul>
      </nav>

      <main>
        <p>Home</p>
      </main>

      <footer>
        <a
          className={commonStyles.flexCenter}
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Powered by</span>
          <img src="/vercel.svg" alt="Vercel" className={commonStyles.logo} />
        </a>
      </footer>
    </div>
  );
}
