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
import { useDispatch, useSelector } from "react-redux";

import commonStyles from "../styles/common.module.scss";
import addNoteStyles from "./add-note.module.scss";

import { Header, Footer } from "../components";
import { iconComponents, pageTitles } from "../components/utils";
import { RootState, addNewField } from "../components/stores";

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
  const dispatch = useDispatch();
  const noteCatcherFormFieldHierachy = useSelector((state: RootState) => {
    const foo = "bar";
    return state.addNote.formFields;
  });

  const [showAddInputMenu, setShowAddInputMenu] = useState(false);

  const recursivelyFormNoteCatcherHierarchicalFields = () => {
    const output: JSX.Element[] = [];

    const fieldsCount = noteCatcherFormFieldHierachy.length;

    let c = 0;
    for (const formfieldKey in noteCatcherFormFieldHierachy) {
      if (
        Object.prototype.hasOwnProperty.call(
          noteCatcherFormFieldHierachy,
          formfieldKey,
        )
      ) {
        const formField = noteCatcherFormFieldHierachy[formfieldKey];
        const { type, label, level, key } = formField.meta;

        output.push(
          <NoteCatcherFormField
            key={formField.key}
            type={type}
            label={label}
            level={level}
            elemKey={key}
            // TODO: improvise the first and last node logic
            firstNode={c == 0}
            lastNode={c === fieldsCount - 1}
          />,
        );

        c++;
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
          <Button
            color="secondary"
            variant="contained"
            onClick={() => dispatch(addNewField())}
          >
            Input Box
          </Button>
        </Backdrop>
      </main>

      <Footer />
    </div>
  );
}

interface NoteCatcherFormFieldType {
  elemKey: string;
  type: string;
  label: string;
  level: number;
  firstNode: boolean;
  lastNode: boolean;
}

const NoteCatcherFormField = ({
  elemKey,
  type,
  label,
  level,
  firstNode,
  lastNode,
}: NoteCatcherFormFieldType) => {
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

    // TODO: use redux store for managing the formfields
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
              {!firstNode && (
                <Fab
                  className={`${addNoteStyles["move-field-up"]} ${addNoteStyles["menu-option"]}`}
                  size="small"
                  color="primary"
                  aria-label="inputs move up"
                  onClick={() =>
                    repostionNoteCatcherFormField(
                      FORM_FIELD_REPOSE_DIRECTION.UP,
                    )
                  }
                >
                  <ArrowDropUpIcon />
                </Fab>
              )}
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
              {!lastNode && (
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
              )}
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
            <MenuItem onClick={addRefNoteCatcherFormField} disableRipple>
              <span
                className={addNoteStyles["note-catcher-form-field-menu-icon"]}
              >
                <PlusIcon />
              </span>
              Add child input
            </MenuItem>
          </Menu>
        </section>
      );

    case "image":
      return <section></section>;
  }
};
