import { useRef, useState, forwardRef, Dispatch, SetStateAction } from "react";
import Head from "next/head";
import {
  Button,
  Fab,
  Backdrop,
  TextField,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import commonStyles from "../styles/common.module.scss";
import addNoteStyles from "./add-note.module.scss";

import { Header, Footer } from "../components";
import { generateUUID, iconComponents, pageTitles } from "../components/utils";
import Image from "next/image";

const {
  PlusIcon,
  MoreVertIcon,
  DragIndicatorIcon,
  SettingsEthernetIcon,
  DeleteIcon,
} = iconComponents;

type InputTypes = "input" | "image" | "map";

interface InputFieldInfo {
  type: InputTypes;
  key: string;
  style: {
    width: string;
    left: string;
    top: string;
  };
  repositionElement: boolean;
}
interface NoteCatcherFieldsData {
  formFields: Map<string, InputFieldInfo>;
}

export default function AddNote({}) {
  const [showAddInputMenu, setShowAddInputMenu] = useState(false);
  const defaultInputFieldsInNoteCatcherDat: NoteCatcherFieldsData = {
    formFields: new Map(),
  };
  const [inputFieldsInNoteCatcherData, setInputFieldsInNoteCatcherData] =
    useState(defaultInputFieldsInNoteCatcherDat);
  const [noteCatcherRepositoiningElemKey, setNoteCatcherRepositoiningElemKey] =
    useState("");

  const addInput = (e) => {
    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const formFieldCount = inputFieldsInNoteCatcherReplica.formFields.size;

    const elemKey = generateUUID();
    inputFieldsInNoteCatcherReplica.formFields.set(elemKey, {
      key: elemKey,
      type: "input",
      style: {
        width: "300px",
        left: "50px",
        top: `${formFieldCount * 100}px`,
      },
      repositionElement: false,
    });

    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
  };
  const onMouseUpInNoteCatcher = (e: React.MouseEvent) => {
    const newMousePositionY = `${e.clientY - 160}px`;
    const newMousePositionX = `${e.clientX - 90}px`;

    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const formFieldDataReplica = inputFieldsInNoteCatcherReplica.formFields.get(
      noteCatcherRepositoiningElemKey,
    );

    if (formFieldDataReplica) {
      formFieldDataReplica.repositionElement = false;
      formFieldDataReplica.style.top = newMousePositionY;
      formFieldDataReplica.style.left = newMousePositionX;
      inputFieldsInNoteCatcherReplica.formFields.set(
        noteCatcherRepositoiningElemKey,
        formFieldDataReplica,
      );

      setNoteCatcherRepositoiningElemKey("");
      setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
    }
  };
  const enableRepositionOnFormField = (elemKey: string) => {
    setNoteCatcherRepositoiningElemKey(elemKey);

    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const formFieldDataReplica =
      inputFieldsInNoteCatcherReplica.formFields.get(elemKey);

    if (formFieldDataReplica) {
      formFieldDataReplica.repositionElement = true;
      inputFieldsInNoteCatcherReplica.formFields.set(
        elemKey,
        formFieldDataReplica,
      );
    }

    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
  };
  const deleteNoteCatcherFormField = (elemKey: string) => {
    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    inputFieldsInNoteCatcherReplica.formFields.delete(elemKey);
    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
  };

  const constructedformFieldComponents: JSX.Element[] = [];
  for (const [key, formFieldElem] of inputFieldsInNoteCatcherData.formFields) {
    constructedformFieldComponents.push(
      <NoteCatcherFormFieldForwarded
        key={formFieldElem.key}
        data={formFieldElem}
        enableRepositionOnFormField={enableRepositionOnFormField}
        deleteNoteCatcherFormField={deleteNoteCatcherFormField}
      />,
    );
  }

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{pageTitles.ADD_NOTE}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main
        className={addNoteStyles["note-catcher"]}
        onClick={onMouseUpInNoteCatcher}
      >
        <section className={addNoteStyles["note-pad"]}>
          <section className={addNoteStyles["note-pad-overflow-content"]}>
            {constructedformFieldComponents}
          </section>
        </section>
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

interface NoteCatcherFormFieldType {
  data: InputFieldInfo;
  enableRepositionOnFormField: (elemKey: string) => void;
  deleteNoteCatcherFormField: (elemKey: string) => void;
}

const NoteCatcherFormFieldForwarded = ({
  data,
  enableRepositionOnFormField,
  deleteNoteCatcherFormField,
}: NoteCatcherFormFieldType) => {
  const { key, style, type, repositionElement } = data;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOnMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dragNoteCatcherFormField = (e) => {
    handleClose();
    enableRepositionOnFormField(key);
  };

  const addRefNoteCatcherFormField = (e) => {
    handleClose();
  };

  const deleteNoteCatcherFormFieldChild = (e) => {
    handleClose();
    deleteNoteCatcherFormField(key);
  };

  const openMenu = Boolean(anchorEl);

  switch (type) {
    case "input":
      return (
        <section
          className={addNoteStyles["formfield-holder"]}
          style={{
            left: style.left,
            width: style.width,
            top: style.top,
          }}
        >
          <Fab
            className={addNoteStyles["menu"]}
            size="small"
            color="primary"
            aria-label="inputs options"
            onClick={handleOnMenuClick}
          >
            <MoreVertIcon />
          </Fab>
          {repositionElement && (
            <Fab
              className={addNoteStyles["move-field"]}
              size="small"
              color="primary"
              aria-label="inputs is moving"
            >
              <SettingsEthernetIcon />
            </Fab>
          )}
          <TextField
            label={`input-${key}`}
            multiline
            margin="normal"
            fullWidth
          />
          <Menu
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={dragNoteCatcherFormField} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <DragIndicatorIcon />
              </span>
              Move
            </MenuItem>
            <MenuItem onClick={addRefNoteCatcherFormField} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <PlusIcon />
              </span>
              Add Refs
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={deleteNoteCatcherFormFieldChild} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <DeleteIcon />
              </span>
              Delete
            </MenuItem>
          </Menu>
        </section>
      );

    case "image":
      return (
        <section
          className={addNoteStyles["formfield-holder"]}
          style={{
            left: style.left,
            width: style.width,
            top: style.top,
          }}
        >
          <Fab size="small" color="primary" aria-label="inputs options">
            <MoreVertIcon />
          </Fab>
          <Image
            alt=""
            src="https://ai-my-personal-notes-general-storage.s3.amazonaws.com/dense-fog-engulfs-delhi-with-almost-zero-visibility--flights-diverted-27375824-16x9_0.avif"
          />
          <Menu
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <DragIndicatorIcon />
              </span>
              Move
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleClose} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <PlusIcon />
              </span>
              Add More
            </MenuItem>
          </Menu>
        </section>
      );
  }
};
