import { useState } from "react";
import Head from "next/head";
import { Button, Fab, Backdrop, TextField } from "@mui/material";

import commonStyles from "../styles/common.module.scss";
import addNoteStyles from "./add-note.module.scss";

import { Header, Footer } from "../components";
import { iconComponents, pageTitles } from "../components/utils";

const { PlusIcon } = iconComponents;

interface InputFieldData {
  key: number;
  width: "300px";
  marginLeft: "100px";
}
interface AllInputsData {
  inputs: InputFieldData[];
}

export default function Home({}) {
  const [showAddInputMenu, setShowAddInputMenu] = useState(false);

  const defaultInputFieldsInNoteCatcherDat: AllInputsData = {
    inputs: [],
  };
  const [inputFieldsInNoteCatcherData, setInputFieldsInNoteCatcherData] =
    useState(defaultInputFieldsInNoteCatcherDat);
  const addInput = (e) => {
    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };

    const inputFieldsCount = Object.keys(
      inputFieldsInNoteCatcherReplica.inputs,
    );

    inputFieldsInNoteCatcherReplica.inputs = [
      ...inputFieldsInNoteCatcherReplica.inputs,
      {
        key: inputFieldsCount.length,
        width: "300px",
        marginLeft: "100px",
      },
    ];

    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
  };

  const inputBoxes: JSX.Element[] = [];
  for (let i = 0; i < inputFieldsInNoteCatcherData.inputs.length; i++) {
    const inputField = inputFieldsInNoteCatcherData.inputs[i];
    inputBoxes.push(
      <section
        className={addNoteStyles["textfield-holder"]}
        style={{ marginLeft: inputField.marginLeft, width: inputField.width }}
      >
        <TextField
          label={`input-${inputField.key}`}
          multiline
          margin="normal"
          fullWidth
        />
      </section>,
    );
  }

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{pageTitles.ADD_NOTE}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={addNoteStyles["note-catcher"]}>
        <p>{pageTitles.ADD_NOTE}</p>
        <section className={addNoteStyles["note-pad"]}>{inputBoxes}</section>
        <Fab
          color="primary"
          aria-label="add"
          className={addNoteStyles["floating-add-note-inputs"]}
          onClick={(e) => setShowAddInputMenu(true)}
        >
          <PlusIcon />
        </Fab>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showAddInputMenu}
          onClick={(e) => setShowAddInputMenu(false)}
        >
          <Button color="secondary" variant="contained" onClick={addInput}>
            Input Box
          </Button>
        </Backdrop>
      </main>

      <Footer />
    </div>
  );
}
