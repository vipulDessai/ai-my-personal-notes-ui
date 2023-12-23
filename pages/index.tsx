import Head from "next/head";

import commonStyles from "../styles/common.module.scss";

import { Header, Footer } from "./components";

export default function Home() {
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <p>Home</p>
      </main>

      <Footer />
    </div>
  );
}
