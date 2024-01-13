import { MouseEvent, ChangeEvent, useState } from "react";
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
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";

import commonStyles from "../styles/common.module.scss";
import addNoteStyles from "./add-note.module.scss";

import { Header, Footer } from "../components";
import {
  FORM_FIELD_INPUT_TYPES,
  FORM_FIELD_REPOSE_DIRECTION,
  FORM_FIELD_RESIZE_DIRECTION,
  iconComponents,
  pageTitles,
} from "../components/utils";
import {
  InputModifyInfoType,
  RootState,
  addFieldToParent,
  addNewField,
  fieldValueOnChange,
  removeField,
  repositionField,
  saveForm,
  setRepositionElement,
  setResizeElement,
} from "../components/stores";
import moment from "moment";

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

export default function AddNote() {
  const dispatch = useDispatch();
  const addNoteStoreState = useSelector((state: RootState) => state.addNote);

  const [showAddInputMenu, setShowAddInputMenu] = useState(false);

  const recursivelyFormNoteCatcherHierarchicalFields = () => {
    const internalRecurringSrchFormElem = (
      curFormFields: ReturnType<() => typeof addNoteStoreState.formFields>,
      isRootElem: boolean,
      curLabelPrefix: string,
    ) => {
      const curOut: JSX.Element[] = [];
      for (let i = 0; i < curFormFields.length; i++) {
        const firstNode = isRootElem && i === 0;
        // TODO: if the last node has any child element then the last child should be marked
        // as the last node and not its parent
        const lastRootNode = isRootElem && i === curFormFields.length - 1;

        const formField = curFormFields[i];

        // the formField is null if that node is deleted from redux slice
        if (formField) {
          const { type, key, repositionElement, resizeElement } =
            formField.meta;

          const childNodes = internalRecurringSrchFormElem(
            formField.childFields,
            false,
            `${curLabelPrefix}${i + 1}.`,
          );

          curOut.push(
            <NoteCatcherFormField
              key={key}
              type={type}
              label={`${curLabelPrefix}${i + 1}`}
              elemKey={key}
              // TODO: improvise the first and last node logic
              firstNode={firstNode}
              lastNode={false}
              childNodes={childNodes}
              repositionElement={repositionElement}
              resizeElement={resizeElement}
              siblingInputModifyInfo={addNoteStoreState.inputModifyInfo}
              value={formField.value}
            />,
          );
        }
      }

      return curOut;
    };

    const output = internalRecurringSrchFormElem(
      addNoteStoreState.formFields,
      true,
      "",
    );

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
          className={addNoteStyles["add-note-menu"]}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showAddInputMenu}
          onClick={() => setShowAddInputMenu(false)}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={() =>
              dispatch(addNewField({ type: FORM_FIELD_INPUT_TYPES.INPUT }))
            }
          >
            Input Box
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() =>
              dispatch(addNewField({ type: FORM_FIELD_INPUT_TYPES.IMAGE }))
            }
          >
            Image
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() =>
              dispatch(
                addNewField({ type: FORM_FIELD_INPUT_TYPES.DATE_AND_TIME }),
              )
            }
          >
            Date Time
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => dispatch(saveForm())}
          >
            Save
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => dispatch(saveForm())}
          >
            Save As Draft
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
  firstNode: boolean;
  lastNode: boolean;
  repositionElement: boolean;
  resizeElement: boolean;
  siblingInputModifyInfo: InputModifyInfoType;
  childNodes: JSX.Element[];
  value: string;
}

const NoteCatcherFormField = ({
  elemKey,
  type,
  label,
  firstNode,
  lastNode,
  childNodes,
  repositionElement,
  resizeElement,
  siblingInputModifyInfo,
  value,
}: NoteCatcherFormFieldType) => {
  const dispatch = useDispatch();

  const [style, setStyle] = useState({
    left: 50,
    width: 300,
  });
  const [tags, setTags] = useState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOnMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl((event.target || event.currentTarget) as HTMLInputElement);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const enableRepositionNoteCatcherFormField = () => {
    handleClose();
    dispatch(setRepositionElement({ elemKey, value: true }));
  };
  const repostionNoteCatcherFormField = (direction: string) => {
    dispatch(repositionField({ elemKey, direction }));
  };
  const disableRepositionNoteCatcherFormField = () => {
    handleClose();
    dispatch(setRepositionElement({ elemKey, value: false }));
  };

  const addRefNoteCatcherFormField = () => {
    handleClose();
  };

  const deleteNoteCatcherFormFieldChild = () => {
    handleClose();
    dispatch(removeField({ elemKey }));
  };

  const enableResizeOnFormFieldChild = () => {
    handleClose();
    dispatch(setResizeElement({ elemKey, value: true }));
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
  const siblingReadyForModificationOnClick = () => {
    if (siblingInputModifyInfo.actionType === "reposition") {
      dispatch(
        setRepositionElement({
          elemKey: siblingInputModifyInfo.elemKey,
          value: false,
        }),
      );
      dispatch(setRepositionElement({ elemKey, value: true }));
    } else {
      dispatch(
        setResizeElement({
          elemKey: siblingInputModifyInfo.elemKey,
          value: false,
        }),
      );
      dispatch(setResizeElement({ elemKey, value: true }));
    }
  };
  const disableResizeOnFormFieldChild = () => {
    handleClose();
    dispatch(setResizeElement({ elemKey, value: false }));
  };

  const addChildElemToThisFormField = () => {
    handleClose();
    dispatch(
      addFieldToParent({
        parentId: elemKey,
        type: FORM_FIELD_INPUT_TYPES.INPUT,
      }),
    );
  };

  const inputFieldOnChange = (
    event: ChangeEvent<HTMLElement>,
    type: string,
  ) => {
    switch (type) {
      case FORM_FIELD_INPUT_TYPES.INPUT:
        {
          const { value } = (event.target ||
            event.currentTarget) as HTMLInputElement;
          dispatch(fieldValueOnChange({ elemKey, value: value }));
        }

        break;

      default:
        break;
    }
  };

  const renderFormFieldBasedOnType = () => {
    switch (type) {
      case FORM_FIELD_INPUT_TYPES.INPUT: {
        return (
          <TextField
            style={{ width: `${style.width}px` }}
            label={label}
            margin="normal"
            multiline
            fullWidth
            value={value}
            onChange={(e) =>
              inputFieldOnChange(e, FORM_FIELD_INPUT_TYPES.INPUT)
            }
          />
        );
      }

      case FORM_FIELD_INPUT_TYPES.IMAGE:
        return <input type="file" name="" id="" />;

      case FORM_FIELD_INPUT_TYPES.DATE_AND_TIME:
        return (
          <MobileDateTimePicker defaultValue={moment("2022-04-17T15:30")} />
        );

      default:
        break;
    }
  };

  const openMenu = Boolean(anchorEl);

  return (
    <section
      className={addNoteStyles["formfield-holder"]}
      style={{
        marginLeft: `${style.left}px`,
      }}
    >
      <section className={addNoteStyles["text-field-container"]}>
        {!siblingInputModifyInfo.inProgress &&
          !resizeElement &&
          !repositionElement && (
            <Fab
              className={addNoteStyles["menu"]}
              size="small"
              color="primary"
              aria-label="inputs options"
              onClick={handleOnMenuClick}
            >
              <MoreVertIcon />
            </Fab>
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
                  repostionNoteCatcherFormField(FORM_FIELD_REPOSE_DIRECTION.UP)
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
                repostionNoteCatcherFormField(FORM_FIELD_REPOSE_DIRECTION.LEFT)
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
                repostionNoteCatcherFormField(FORM_FIELD_REPOSE_DIRECTION.RIGHT)
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
        {renderFormFieldBasedOnType()}
        {(resizeElement || repositionElement) && (
          <section className={addNoteStyles["highlight-mask"]}></section>
        )}
        {!resizeElement &&
          !repositionElement &&
          siblingInputModifyInfo.inProgress && (
            <section
              className={`${addNoteStyles["highlight-mask"]} ${addNoteStyles["ready-for-modification"]}`}
              onClick={siblingReadyForModificationOnClick}
            ></section>
          )}
      </section>
      {childNodes}
      <Menu
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
      >
        <MenuItem onClick={enableResizeOnFormFieldChild} disableRipple>
          <span className={addNoteStyles["note-catcher-form-field-menu-icon"]}>
            <SettingsEthernetIcon />
          </span>
          Resize
        </MenuItem>
        <MenuItem onClick={enableRepositionNoteCatcherFormField} disableRipple>
          <span className={addNoteStyles["note-catcher-form-field-menu-icon"]}>
            <DragIndicatorIcon />
          </span>
          Move
        </MenuItem>
        <MenuItem onClick={addRefNoteCatcherFormField} disableRipple>
          <span className={addNoteStyles["note-catcher-form-field-menu-icon"]}>
            <PlusIcon />
          </span>
          Add Refs
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={deleteNoteCatcherFormFieldChild} disableRipple>
          <span className={addNoteStyles["note-catcher-form-field-menu-icon"]}>
            <DeleteIcon />
          </span>
          Delete
        </MenuItem>
        <MenuItem onClick={addChildElemToThisFormField} disableRipple>
          <span className={addNoteStyles["note-catcher-form-field-menu-icon"]}>
            <PlusIcon />
          </span>
          Add child input
        </MenuItem>
      </Menu>
    </section>
  );
};
