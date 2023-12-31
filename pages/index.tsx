import { useState } from "react";
import { Button } from "@mui/material";
import Head from "next/head";
import { useDispatch } from "react-redux";

import commonStyles from "../styles/common.module.scss";
import homePageStyles from "./index.module.scss";

import { Header, Footer } from "../components";
import { pageTitles, getData, errorHandler } from "../components/utils";
import { hideLoader, setError, showLoader } from "../components/stores";

export default function Home() {
  const dispatch = useDispatch();

  const defualtRetuarantnNamesValue: string[] = [];
  const [restuarantNames, setRestuarantNames] = useState(
    defualtRetuarantnNamesValue,
  );

  const makeApiCallTest = async () => {
    dispatch(showLoader());
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
      dispatch(setError(errorHandler(error)));
    }
    dispatch(hideLoader());
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
