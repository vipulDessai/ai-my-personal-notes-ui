import { useState } from "react";
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
  ArrowLeftIcon,
  ArrowRightIcon,
  DoneIcon,
} = iconComponents;

type InputTypes = "input" | "image" | "map";

interface InputFieldInfo {
  type: InputTypes;
  key: string;
  label: string;
  style: {
    width: number;
    left: number;
  };
  repositionElement: boolean;
  resizeElement: boolean;
  tags: string[];
}
interface NoteCatcherFieldsData {
  formFields: Map<string, InputFieldInfo>;
}

interface NoteCatcherFieldsHierarchy {
  key: string;
  childFields: NoteCatcherFieldsHierarchy[];
}

const FORM_FIELD_RESIZE_DIRECTION = {
  LEFT: "left",
  RIGHT: "right",
};

export default function AddNote({}) {
  const [showAddInputMenu, setShowAddInputMenu] = useState(false);
  const defaultInputFieldsInNoteCatcherDat: NoteCatcherFieldsData = {
    formFields: new Map(),
  };
  const [inputFieldsInNoteCatcherData, setInputFieldsInNoteCatcherData] =
    useState(defaultInputFieldsInNoteCatcherDat);
  const [noteCatcherRepositoiningElemKey, setNoteCatcherRepositoiningElemKey] =
    useState("");

  const defaultNoteCatcherFormFieldHierachy: NoteCatcherFieldsHierarchy[] = [];
  const [noteCatcherFormFieldHierachy, setNoteCatcherFormFieldHierachy] =
    useState(defaultNoteCatcherFormFieldHierachy);

  const addInput = (e) => {
    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const noteCatcherFormFieldHierachyReplica = [
      ...noteCatcherFormFieldHierachy,
    ];

    const elemKey = generateUUID();

    noteCatcherFormFieldHierachyReplica.push({
      key: elemKey,
      childFields: [],
    });
    setNoteCatcherFormFieldHierachy(noteCatcherFormFieldHierachyReplica);

    inputFieldsInNoteCatcherReplica.formFields.set(elemKey, {
      key: elemKey,
      label: noteCatcherFormFieldHierachyReplica.length.toString(),
      type: "input",
      style: {
        width: 300,
        left: 50,
      },
      repositionElement: false,
      resizeElement: false,
      tags: [],
    });

    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
  };
  const setNewPositionNoteCatcherField = (e: React.MouseEvent) => {
    // TODO: use the vertical position value for repositioning the form field vertically
    const newMousePositionY = e.clientY - 160;
    const newMousePositionX = e.clientX - 90;

    console.log(newMousePositionY);

    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const formFieldDataReplica = inputFieldsInNoteCatcherReplica.formFields.get(
      noteCatcherRepositoiningElemKey,
    );

    if (formFieldDataReplica) {
      formFieldDataReplica.repositionElement = false;
      formFieldDataReplica.style.left = newMousePositionX;
      inputFieldsInNoteCatcherReplica.formFields.set(
        noteCatcherRepositoiningElemKey,
        formFieldDataReplica,
      );

      setNoteCatcherRepositoiningElemKey("");
      setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
    }
  };
  const performResizeOnFormField = (elemKey: string, direction: string) => {
    setNoteCatcherRepositoiningElemKey(elemKey);

    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const formFieldDataReplica =
      inputFieldsInNoteCatcherReplica.formFields.get(elemKey);

    if (formFieldDataReplica) {
      if (direction === FORM_FIELD_RESIZE_DIRECTION.LEFT) {
        formFieldDataReplica.style.width += 100;
      } else {
        formFieldDataReplica.style.width -= 100;
      }

      inputFieldsInNoteCatcherReplica.formFields.set(
        elemKey,
        formFieldDataReplica,
      );
    }

    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
  };
  const resizeOnFormField = (elemKey: string, status: boolean) => {
    setNoteCatcherRepositoiningElemKey(status ? elemKey : "");

    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const formFieldDataReplica =
      inputFieldsInNoteCatcherReplica.formFields.get(elemKey);

    if (formFieldDataReplica) {
      formFieldDataReplica.resizeElement = status;
      inputFieldsInNoteCatcherReplica.formFields.set(
        elemKey,
        formFieldDataReplica,
      );
    }

    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
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

    // TODO - delete key from noteCatcherFormFieldHierachyReplica
  };

  const constructedformFieldComponents: JSX.Element[] = [];
  for (const [key, formFieldElem] of inputFieldsInNoteCatcherData.formFields) {
    constructedformFieldComponents.push(
      <NoteCatcherFormFieldForwarded
        key={formFieldElem.key}
        data={formFieldElem}
        enableRepositionOnFormField={enableRepositionOnFormField}
        deleteNoteCatcherFormField={deleteNoteCatcherFormField}
        performResizeOnFormField={performResizeOnFormField}
        resizeOnFormField={resizeOnFormField}
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
        className={`${addNoteStyles["note-catcher"]} ${
          noteCatcherRepositoiningElemKey
            ? addNoteStyles["reposition-form-fields-enabled"]
            : ""
        }`}
        onClick={setNewPositionNoteCatcherField}
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
  performResizeOnFormField: (elemKey: string, direction: string) => void;
  resizeOnFormField: (elemKey: string, status: boolean) => void;
}

const NoteCatcherFormFieldForwarded = ({
  data,
  enableRepositionOnFormField,
  deleteNoteCatcherFormField,
  performResizeOnFormField,
  resizeOnFormField,
}: NoteCatcherFormFieldType) => {
  const { key, style, type, repositionElement, label, resizeElement } = data;
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

  const enableResizeOnFormFieldChild = (e) => {
    handleClose();
    resizeOnFormField(key, true);
  };
  const performResizeOnFormFieldChild = (e, direction: string) => {
    handleClose();
    performResizeOnFormField(key, direction);
  };
  const setResizeOnFormFieldChild = (e) => {
    handleClose();
    resizeOnFormField(key, false);
  };

  const openMenu = Boolean(anchorEl);

  switch (type) {
    case "input":
      return (
        <section
          className={addNoteStyles["formfield-holder"]}
          style={{
            left: `${style.left}px`,
            width: `${style.width}px`,
          }}
        >
          {!resizeElement && !repositionElement && (
            <>
              <Fab
                className={addNoteStyles["menu"]}
                size="small"
                color="primary"
                aria-label="inputs options"
                onClick={handleOnMenuClick}
              >
                <MoreVertIcon />
              </Fab>
            </>
          )}
          {resizeElement && (
            <>
              <Fab
                className={addNoteStyles["resize-left"]}
                size="small"
                color="primary"
                aria-label="inputs resize left"
                onClick={(e) =>
                  performResizeOnFormFieldChild(
                    e,
                    FORM_FIELD_RESIZE_DIRECTION.LEFT,
                  )
                }
              >
                <ArrowLeftIcon />
              </Fab>
              <Fab
                className={addNoteStyles["resize-done"]}
                size="small"
                color="primary"
                aria-label="inputs resize done"
                onClick={setResizeOnFormFieldChild}
              >
                <DoneIcon />
              </Fab>
              <Fab
                className={addNoteStyles["resize-right"]}
                size="small"
                color="primary"
                aria-label="inputs resize right"
                onClick={(e) =>
                  performResizeOnFormFieldChild(
                    e,
                    FORM_FIELD_RESIZE_DIRECTION.RIGHT,
                  )
                }
              >
                <ArrowRightIcon />
              </Fab>
            </>
          )}
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
          <TextField label={label} margin="normal" multiline fullWidth />
          <Menu
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={enableResizeOnFormFieldChild} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <SettingsEthernetIcon />
              </span>
              Resize
            </MenuItem>
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
            left: `${style.left}px`,
            width: `${style.width}px`,
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
