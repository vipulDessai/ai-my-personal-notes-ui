import Head from "next/head";

import commonStyles from "../styles/common.module.scss";
import homePageStyles from "./index.module.scss";

import { Header, Footer, pageTitles } from "../components";
import { Button } from "@mui/material";
import { useState } from "react";
import { getData } from "../components/utils/api-caller.helper";

export default function Home() {
  const defualtRetuarantnNamesValue: string[] = [];
  const [restuarantNames, setRestuarantNames] = useState(
    defualtRetuarantnNamesValue,
  );
  const makeApiCallTest = async (e) => {
    try {
      const res = await getData(
        "https://oawjhv45uxgiecznjtfd5twnja0yuxtq.lambda-url.us-east-1.on.aws",
      );
      const resToArr = res.split(",");

      const normalizedRestuarantsData: string[] = [];
      for (let i = 0; i < resToArr.length && i < 10; i++) {
        normalizedRestuarantsData.push(resToArr[i]);
      }

      setRestuarantNames(normalizedRestuarantsData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{pageTitles.HOME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <p>{pageTitles.HOME}</p>
        <section className={homePageStyles["api-call-tester"]}>
          <Button variant="outlined" onClick={makeApiCallTest}>
            API call
          </Button>
          <ul>
            {restuarantNames.map((r, uniqueKey) => (
              <li key={uniqueKey}>{r}</li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
