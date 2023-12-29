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
  RemoveIcon,
  MoreVertIcon,
  DragIndicatorIcon,
  SettingsEthernetIcon,
  DeleteIcon,
  ArrowDropUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDropDownIcon,
  DoneIcon,
} = iconComponents;

type InputTypes = "input" | "image" | "map";

interface InputFieldInfo {
  type: InputTypes;
  label: string;
  level: number;
  key: string;
}

interface NoteCatcherFieldsHierarchy {
  key: string;
  meta: InputFieldInfo;
  childFields: NoteCatcherFieldsHierarchy[];
}

const FORM_FIELD_RESIZE_DIRECTION = {
  INC: "+",
  DECREASE: "-",
};
const FORM_FIELD_REPOSE_DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "l",
  RIGHT: "r",
};

export default function AddNote() {
  const [showAddInputMenu, setShowAddInputMenu] = useState(false);
  const defaultNoteCatcherFormFieldHierachy: NoteCatcherFieldsHierarchy[] = [];
  const [noteCatcherFormFieldHierachy, setNoteCatcherFormFieldHierachy] =
    useState(defaultNoteCatcherFormFieldHierachy);

  const addInput = () => {
    const noteCatcherFormFieldHierachyReplica = [
      ...noteCatcherFormFieldHierachy,
    ];
    const elemKey = generateUUID();
    noteCatcherFormFieldHierachyReplica.push({
      key: elemKey,
      // TODO - add label and level with proper value
      meta: {
        key: elemKey,
        label: elemKey,
        level: 0,
        type: "input",
      },
      childFields: [],
    });
    setNoteCatcherFormFieldHierachy(noteCatcherFormFieldHierachyReplica);
  };
  const deleteNoteCatcherFormField = (elemKey: string) => {
    // TODO - delete key from noteCatcherFormFieldHierachyReplica
    const noteCatcherFormFieldHierachyReplica = [
      ...noteCatcherFormFieldHierachy,
    ];
    setNoteCatcherFormFieldHierachy(noteCatcherFormFieldHierachyReplica);
  };

  const recursivelyFormNoteCatcherHierarchicalFields = () => {
    const output: JSX.Element[] = [];

    for (const formfieldKey in noteCatcherFormFieldHierachy) {
      if (
        Object.prototype.hasOwnProperty.call(
          noteCatcherFormFieldHierachy,
          formfieldKey,
        )
      ) {
        const formField = noteCatcherFormFieldHierachy[formfieldKey];

        output.push(
          <NoteCatcherFormField
            key={formField.key}
            data={formField.meta}
            deleteNoteCatcherFormField={deleteNoteCatcherFormField}
          />,
        );
      }
    }

    return output;
  };

  const constructedformFieldComponents: JSX.Element[] =
    recursivelyFormNoteCatcherHierarchicalFields();

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{pageTitles.ADD_NOTE}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={addNoteStyles["note-catcher"]}>
        <section className={addNoteStyles["note-pad"]}>
          <section className={addNoteStyles["note-pad-overflow-content"]}>
            {constructedformFieldComponents}
          </section>
        </section>
        <Fab
          color="primary"
          aria-label="add"
          className={addNoteStyles["floating-add-note-inputs"]}
          onClick={() => setShowAddInputMenu(true)}
        >
          <PlusIcon />
        </Fab>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showAddInputMenu}
          onClick={() => setShowAddInputMenu(false)}
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
  // eslint-disable-next-line no-unused-vars
  deleteNoteCatcherFormField: (elemKey: string) => void;
}

const NoteCatcherFormField = ({
  data,
  deleteNoteCatcherFormField,
}: NoteCatcherFormFieldType) => {
  const { key, type, label, level } = data;
  const [repositionElement, setRepositionElement] = useState(false);
  const [resizeElement, setResizeElement] = useState(false);
  const [style, setStyle] = useState({
    left: 50,
    width: 300,
  });
  const [tags, setTags] = useState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOnMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const enableRepositionNoteCatcherFormField = () => {
    handleClose();
    setRepositionElement(true);
  };
  const repostionNoteCatcherFormField = (direction: string) => {
    const styleReplica = { ...style };

    switch (direction) {
      case FORM_FIELD_REPOSE_DIRECTION.UP:
        styleReplica.left += 50;
        break;

      case FORM_FIELD_REPOSE_DIRECTION.LEFT:
        styleReplica.left -= 50;
        break;

      case FORM_FIELD_REPOSE_DIRECTION.RIGHT:
        styleReplica.left += 50;
        break;

      case FORM_FIELD_REPOSE_DIRECTION.DOWN:
        styleReplica.left -= 50;
        break;

      default:
        break;
    }

    setStyle(styleReplica);
  };
  const disableRepositionNoteCatcherFormField = () => {
    handleClose();
    setRepositionElement(false);
  };

  const addRefNoteCatcherFormField = () => {
    handleClose();
  };

  const deleteNoteCatcherFormFieldChild = () => {
    handleClose();
    deleteNoteCatcherFormField(key);
  };

  const enableResizeOnFormFieldChild = () => {
    handleClose();
    setResizeElement(true);
  };
  const performResizeOnFormFieldChild = (direction: string) => {
    handleClose();

    const styleReplica = { ...style };
    if (direction === FORM_FIELD_RESIZE_DIRECTION.INC) {
      styleReplica.width += 50;
    } else {
      styleReplica.width -= 50;
    }
    setStyle(styleReplica);
  };
  const disableResizeOnFormFieldChild = () => {
    handleClose();
    setResizeElement(false);
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
                className={`${addNoteStyles["resize-left"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs resize left"
                onClick={() =>
                  performResizeOnFormFieldChild(
                    FORM_FIELD_RESIZE_DIRECTION.DECREASE,
                  )
                }
              >
                <RemoveIcon />
              </Fab>
              <Fab
                className={`${addNoteStyles["resize-done"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs resize done"
                onClick={disableResizeOnFormFieldChild}
              >
                <DoneIcon />
              </Fab>
              <Fab
                className={`${addNoteStyles["resize-right"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs resize right"
                onClick={() =>
                  performResizeOnFormFieldChild(FORM_FIELD_RESIZE_DIRECTION.INC)
                }
              >
                <PlusIcon />
              </Fab>
            </>
          )}
          {repositionElement && (
            <>
              <Fab
                className={`${addNoteStyles["move-field-done"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs done moving"
                onClick={disableRepositionNoteCatcherFormField}
              >
                <DoneIcon />
              </Fab>
              <Fab
                className={`${addNoteStyles["move-field-up"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs move up"
                onClick={() =>
                  repostionNoteCatcherFormField(FORM_FIELD_REPOSE_DIRECTION.UP)
                }
              >
                <ArrowDropUpIcon />
              </Fab>
              <Fab
                className={`${addNoteStyles["move-field-left"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs move to left"
                onClick={() =>
                  repostionNoteCatcherFormField(
                    FORM_FIELD_REPOSE_DIRECTION.LEFT,
                  )
                }
              >
                <ArrowLeftIcon />
              </Fab>
              <Fab
                className={`${addNoteStyles["move-field-right"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs move to right"
                onClick={() =>
                  repostionNoteCatcherFormField(
                    FORM_FIELD_REPOSE_DIRECTION.RIGHT,
                  )
                }
              >
                <ArrowRightIcon />
              </Fab>
              <Fab
                className={`${addNoteStyles["move-field-down"]} ${addNoteStyles["menu-option"]}`}
                size="small"
                color="primary"
                aria-label="inputs move down"
                onClick={() =>
                  repostionNoteCatcherFormField(
                    FORM_FIELD_REPOSE_DIRECTION.DOWN,
                  )
                }
              >
                <ArrowDropDownIcon />
              </Fab>
            </>
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
            <MenuItem
              onClick={enableRepositionNoteCatcherFormField}
              disableRipple
            >
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
      return <section></section>;
  }
};
