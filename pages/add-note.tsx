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
  AddCardIcon,
  SettingsEthernetIcon,
} = iconComponents;

type InputTypes = "input" | "image" | "map";

interface InputFieldInfo {
  type: InputTypes;
  key: string;
  style: {
    width: string;
    marginLeft: string;
    top: string;
  };
}
interface NoteCatcherFieldsData {
  formFields: Set<InputFieldInfo>;
}

export default function AddNote({}) {
  const [showAddInputMenu, setShowAddInputMenu] = useState(false);
  const noteCatcherCurrentlyMovableField = useRef<HTMLDivElement>();
  const [enableDragOnFieldElement, setEnableDragOnFieldElement] =
    useState(false);

  const defaultInputFieldsInNoteCatcherDat: NoteCatcherFieldsData = {
    formFields: new Set(),
  };
  const [inputFieldsInNoteCatcherData, setInputFieldsInNoteCatcherData] =
    useState(defaultInputFieldsInNoteCatcherDat);
  const addInput = (e) => {
    const inputFieldsInNoteCatcherReplica = { ...inputFieldsInNoteCatcherData };
    const formFieldCount = inputFieldsInNoteCatcherReplica.formFields.size;
    inputFieldsInNoteCatcherReplica.formFields.add({
      key: generateUUID(),
      type: "input",
      style: {
        width: "300px",
        marginLeft: "100px",
        top: `${formFieldCount * 100}px`,
      },
    });

    setInputFieldsInNoteCatcherData(inputFieldsInNoteCatcherReplica);
  };

  const onMouseMoveInNoteCatcher = (e: React.MouseEvent) => {
    if (noteCatcherCurrentlyMovableField.current) {
      console.log(e.clientX, e.clientY);

      noteCatcherCurrentlyMovableField.current.style.top = `${
        e.clientY - 160
      }px`;
      noteCatcherCurrentlyMovableField.current.style.left = `${
        e.clientX - 90
      }px`;
    }
  };

  const constructedformFieldComponents: JSX.Element[] = [];
  const formFieldsArray = Array.from(inputFieldsInNoteCatcherData.formFields);
  for (let i = 0; i < formFieldsArray.length; i++) {
    const currentInputFieldData = formFieldsArray[i];
    constructedformFieldComponents.push(
      <NoteCatcherFormFieldForwarded
        ref={noteCatcherCurrentlyMovableField}
        key={currentInputFieldData.key}
        data={currentInputFieldData}
        enableDragOnFieldElement={enableDragOnFieldElement}
        setEnableDragOnFieldElement={setEnableDragOnFieldElement}
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
        onMouseMove={onMouseMoveInNoteCatcher}
      >
        <p>{pageTitles.ADD_NOTE}</p>
        <section className={addNoteStyles["note-pad"]}>
          {constructedformFieldComponents}
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

// TODO: moke the below component a dragable
// remove the ts ignore tag
interface NoteCatcherFormFieldType {
  data: InputFieldInfo;
  enableDragOnFieldElement: boolean;
  setEnableDragOnFieldElement: Dispatch<SetStateAction<boolean>>;
}

const NoteCatcherFormFieldForwarded = forwardRef(function NoteCatcherFormField(
  {
    data,
    enableDragOnFieldElement,
    setEnableDragOnFieldElement,
  }: NoteCatcherFormFieldType,
  parentFormFieldRef,
) {
  const { key, style, type } = data;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOnMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dragNoteCatcherFormField = (e) => {
    setEnableDragOnFieldElement(!enableDragOnFieldElement);
  };

  const addRefNoteCatcherFormField = (e) => {
    handleClose();
  };

  const openMenu = Boolean(anchorEl);

  switch (type) {
    case "input":
      return (
        <section
          // TODO: fix the below ts ref type
          // @ts-ignore:next-line
          ref={enableDragOnFieldElement ? parentFormFieldRef : null}
          className={addNoteStyles["formfield-holder"]}
          style={{
            marginLeft: style.marginLeft,
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
          <Fab
            className={addNoteStyles["move-field"]}
            size="small"
            color="primary"
            aria-label="inputs move"
            onClick={dragNoteCatcherFormField}
          >
            <SettingsEthernetIcon />
          </Fab>
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
            <MenuItem onClick={handleClose} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <DragIndicatorIcon />
              </span>
              Move
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={addRefNoteCatcherFormField} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <AddCardIcon />
              </span>
              Add More
            </MenuItem>
          </Menu>
        </section>
      );

    case "image":
      return (
        <section
          className={addNoteStyles["formfield-holder"]}
          style={{
            marginLeft: style.marginLeft,
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
                <AddCardIcon />
              </span>
              Add More
            </MenuItem>
          </Menu>
        </section>
      );
  }
});
