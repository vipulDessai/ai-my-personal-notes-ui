import { useState } from "react";
import { Button } from "@mui/material";
import Head from "next/head";
import { useDispatch } from "react-redux";

import commonStyles from "../styles/common.module.scss";
import homePageStyles from "./index.module.scss";

import { Header, Footer } from "../components";
import {
  pageTitles,
  getData,
  errorHandler,
  postData,
} from "../components/utils";
import {
  AppDispatch,
  hideLoader,
  setError,
  showLoader,
} from "../components/stores";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

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

  const makeGraphQlLambdaCall = async () => {
    dispatch(showLoader());
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwYmFmMGU0Ni1jMTRjLTRhN2ItYTk2ZC02NjYyNGJkM2E0OGIiLCJuYW1lIjoiaHJsZWFkZXJAZXhhbXBsZS5jb20iLCJyb2xlIjpbImhyIiwibGVhZGVyIl0sIm5iZiI6MTcwNjE5MDIwNiwiZXhwIjoxNzEzOTY2MjA2LCJpYXQiOjE3MDYxOTAyMDYsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIn0.i0MRrHBrAaXLYjafp6X6DkHQ_Fjxq-0TlJk4Q681K60",
      };
      const payload = JSON.stringify({
        query: `query getNote {
          notes (input: {
            batchSize: 10,
          }) {
            statusCode
            body
          }
        }`,
        variables: {},
      });
      const res = await postData(
        `${process.env.NEXT_PUBLIC_API_HOST}/graphql`,
        payload,
        headers,
      );

      console.log(res);
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
          <br></br>
          <Button variant="outlined" onClick={makeGraphQlLambdaCall}>
            GraphQL call
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
