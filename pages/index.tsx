import Head from "next/head";

import commonStyles from "../styles/common.module.scss";

import { Header, Footer, pageTitles } from "../components";

export default function Home() {
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <p>{pageTitles.HOME}</p>
      </main>

      <Footer />
    </div>
  );
}
