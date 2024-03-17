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
  const [notes, setNotes] = useState(defualtRetuarantnNamesValue);

  const makeGraphQlLambdaCall = async () => {
    dispatch(showLoader());
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5ZDVmZjc4Mi05YWIxLTQ2YjQtYTAyNy1hYjVkZDQzN2U1ODQiLCJuYW1lIjoiaHJsZWFkZXJAZXhhbXBsZS5jb20iLCJyb2xlIjpbImhyIiwibGVhZGVyIl0sIm5iZiI6MTcxMDcwMDkwNywiZXhwIjoxNzE4NDc2OTA3LCJpYXQiOjE3MTA3MDA5MDcsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIn0.xEyuIKjlRAiCrU45C_iks5LeZNOfcxDx5Yd6vWnjH0E",
      };
      const payload = `query getNote {
        notes (input: {
          batchSize: 10,
        }) {
          notes {
            key
            value {
              title
              tags
              inputData {
                value
              }
            }
          }
        }
      }`;
      const res = await getData(
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
          <Button variant="outlined" onClick={makeGraphQlLambdaCall}>
            Get Notes
          </Button>
          <ul>
            {notes.map((r, uniqueKey) => (
              <li key={uniqueKey}>{r}</li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
