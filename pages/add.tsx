import Head from "next/head";

import commonStyles from "../styles/common.module.scss";

import { Header, Footer, pageTitles } from "../components";

export default function Home() {
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Add Note</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <p>{pageTitles.ADD_NOTE}</p>
      </main>

      <Footer />
    </div>
  );
}
