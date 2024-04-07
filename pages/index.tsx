import { useEffect } from "react";
import { Button } from "@mui/material";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { useLazyQuery, gql } from "@apollo/client";

import commonStyles from "../styles/common.module.scss";
import homePageStyles from "./index.module.scss";

import { Header, Footer } from "../components";
import { pageTitles, errorHandler } from "../components/utils";
import {
  AppDispatch,
  hideLoader,
  setError,
  showLoader,
} from "../components/stores";

const GET_NOTES_QUERY = gql`
  query getNoteInBatch($size: Int!) {
    notes(input: { batchSize: $size }) {
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
  }
`;

export default function Home() {
  const [getNotesLazy, { loading, error, data: getNotesRes }] =
    useLazyQuery(GET_NOTES_QUERY);

  useEffect(() => {
    if (loading) dispatch(showLoader());
    else dispatch(hideLoader());
  }, [loading]);

  useEffect(() => {
    if (error) {
      dispatch(setError(errorHandler(error)));
    }
  }, [error]);

  const dispatch = useDispatch<AppDispatch>();

  const makeGraphQlLambdaCall = async () => {
    getNotesLazy({ variables: { size: 10 } });
  };

  let notes = [];
  if (getNotesRes && getNotesRes.notes && getNotesRes.notes.notes) {
    notes = getNotesRes.notes.notes;
  }

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
            {notes.map((note: any) => {
              const title = note.value.title;

              return <li key={note.key}>{title}</li>;
            })}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
