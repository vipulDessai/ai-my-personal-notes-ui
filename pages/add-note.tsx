import Head from "next/head";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import commonStyles from "../styles/common.module.scss";
import addNoteStyles from "./add-note.module.scss";

import { Header, Footer } from "../components";
import { pageTitles } from "../components/utils";
import { decrement, increment, RootState } from "../components/stores";

export default function Home() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{pageTitles.ADD_NOTE}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <p>{pageTitles.ADD_NOTE}</p>
        <section className={addNoteStyles["counter-example"]}>
          <Button
            variant="outlined"
            onClick={(e) => {
              dispatch(increment());
            }}
          >
            +
          </Button>
          <p>{count}</p>
          <Button
            variant="outlined"
            onClick={(e) => {
              dispatch(decrement());
            }}
          >
            -
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
