import {
  MouseEvent,
  ChangeEvent,
  useState,
  useEffect,
  forwardRef,
  useRef,
  MutableRefObject,
} from "react";
import {
  Button,
  Fab,
  Backdrop,
  TextField,
  Menu,
  MenuItem,
  Divider,
  Modal,
  CircularProgress,
  Chip,
  Snackbar,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

import commonStyles from "../../styles/common.module.css";
import addNoteStyles from "./AddNote.module.css";

import {
  APP_DATE_TIME_FORMAT,
  FORM_FIELD_INPUT_TYPES,
  FORM_FIELD_REPOSE_DIRECTION,
  FORM_FIELD_RESIZE_DIRECTION,
  iconComponents,
} from "../../components/utils";
import {
  ADD_INPUT_MENU_TYPE,
  AppDispatch,
  InputModifyInfoType,
  RootState,
  addNewField,
  addNotifications,
  fieldValueOnChange,
  removeField,
  repositionField,
  clearForm,
  setInputModifyInProgress,
  setModal,
  setRepositionElement,
  setResizeElement,
  setShowAddInputMenu,
  setTitle,
  setNoteDateTime,
  TagsData,
  setEditPrimaryMeta,
  setTagsForField,
} from "../../components/stores";
import { CustomInputBox } from "../../components/elements";

/** GQL <START> */
import { gql } from "../../gql";
import { NoteInputsInput } from "../../gql/graphql";
/** GQL <END> */

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
  EditIcon,
  ClearIcon,
} = iconComponents;

const ADD_NOTE = gql(`
  mutation addNote(
    $newTags: [NoteTagsInput!]!, $title: String, $date: DateTime!, $primaryTags: [String!], $inputData: [NoteInputsInput!]) {
    updateNote (input: {
      note: {
        inputData: $inputData,
        tags: $primaryTags,
        title: $title,
        date: $date
      }
      newTags: $newTags
    }) {
      message
    }
  }
`);

export default function AddNote() {
  const dispatch = useDispatch<AppDispatch>();

  const [
    addNote,
    {
      data: noteAddedStatus,
      loading: addNoteAPICallLoading,
      error: addNoteError,
    },
  ] = useMutation(ADD_NOTE);

  useEffect(() => {
    if (noteAddedStatus && noteAddedStatus.updateNote) {
      dispatch(addNotifications(noteAddedStatus.updateNote.message));
    }
  }, [noteAddedStatus, dispatch]);

  useEffect(() => {
    if (addNoteError) {
      dispatch(addNotifications(addNoteError.message));
    }
  }, [addNoteError, dispatch]);

  const addNoteStoreState = useSelector(
    (state: RootState) => state.root.addNote,
  );

  const {
    addInputMenu,
    formFields,
    newTags,
    allTags,
    date,
    title,
    inputModifyInfo,
    editPrimaryMeta,
    showModal,
  } = addNoteStoreState;

  const [noteTitleValue, setNoteTitleValue] = useState(title);

  const saveNote = () => {
    const recursivelyFormInputData = (
      allFormFields: ReturnType<() => typeof formFields>,
    ) => {
      if (!allFormFields) return [];

      const normalizedInputdata: NoteInputsInput[] = [];
      for (let i = 0; i < allFormFields.length; ++i) {
        const curFormFieldData = allFormFields[i];

        const curNoteInput: NoteInputsInput = {
          value: curFormFieldData.value,
          date: curFormFieldData.meta.date,
          childInputs: recursivelyFormInputData(curFormFieldData.childFields),
          // TODO: correct the tags ids sent in the payload
          tags: curFormFieldData.meta.tags.map((t) => t.key || t.name),
        };

        normalizedInputdata.push(curNoteInput);
      }

      return normalizedInputdata;
    };

    const inputData = recursivelyFormInputData(formFields);

    addNote({
      variables: {
        newTags: newTags.map((t) => ({ name: t })),
        primaryTags: allTags.map((t) => t.name),
        date: date,
        title: title,
        inputData,
      },
    });
  };

  const recursivelyFormNoteCatcherHierarchicalFields = () => {
    const internalRecurringSrchFormElem = (
      curFormFields: ReturnType<() => typeof formFields>,
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
          const { type, key, repositionElement, resizeElement, date, tags } =
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
              siblingInputModifyInfo={inputModifyInfo}
              value={formField.value}
              date={date}
              tags={tags}
            />,
          );
        }
      }

      return curOut;
    };

    const output = internalRecurringSrchFormElem(formFields, true, "");

    return output;
  };

  const constructedformFieldComponents: JSX.Element[] =
    recursivelyFormNoteCatcherHierarchicalFields();

  return (
    <div className={commonStyles.container}>
      <main className={addNoteStyles["note-catcher"]}>
        <section className={addNoteStyles["basic-details"]}>
          <ul className={addNoteStyles["meta-data-read-only"]}>
            <li>
              <label>{title}</label>
            </li>
            <li>
              {!editPrimaryMeta && (
                <Fab
                  className={addNoteStyles["edit-primary-meta-data"]}
                  size="small"
                  color="primary"
                  aria-label="inputs options"
                  onClick={() => dispatch(setEditPrimaryMeta({ value: true }))}
                >
                  <EditIcon />
                </Fab>
              )}
            </li>
          </ul>
          {editPrimaryMeta && (
            <ul className={addNoteStyles["meta-data-list"]}>
              <TextField
                label={"title"}
                multiline
                fullWidth
                value={noteTitleValue}
                onChange={(event: ChangeEvent<HTMLElement>) => {
                  const { value } = (event.target ||
                    event.currentTarget) as HTMLInputElement;
                  setNoteTitleValue(value);
                }}
              />
              <li>
                <MobileDateTimePicker
                  sx={{ marginTop: "8px" }}
                  onAccept={(
                    currentlySelectedDateInfo: moment.Moment | null,
                  ) => {
                    if (currentlySelectedDateInfo) {
                      const value =
                        currentlySelectedDateInfo.format(APP_DATE_TIME_FORMAT);

                      dispatch(setNoteDateTime({ value }));
                    }
                  }}
                  defaultValue={moment(date)}
                />
              </li>
              <li>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => dispatch(setModal({ value: true }))}
                >
                  Tags
                </Button>
              </li>
              <li className={addNoteStyles["save-primary-meta-data"]}>
                <ul>
                  <li>
                    <Fab
                      className={addNoteStyles["menu"]}
                      size="small"
                      color="primary"
                      aria-label="inputs options"
                      onClick={() => {
                        setNoteTitleValue(title);
                        dispatch(setEditPrimaryMeta({ value: false }));
                      }}
                    >
                      <ClearIcon />
                    </Fab>
                  </li>
                  <li>
                    <Fab
                      className={addNoteStyles["menu"]}
                      size="small"
                      color="primary"
                      aria-label="inputs options"
                      onClick={() => {
                        dispatch(setTitle({ value: noteTitleValue }));
                        dispatch(setEditPrimaryMeta({ value: false }));
                      }}
                    >
                      <DoneIcon />
                    </Fab>
                  </li>
                </ul>
              </li>
            </ul>
          )}
        </section>
        {constructedformFieldComponents.length > 0 && (
          <section className={addNoteStyles["note-pad"]}>
            <section className={addNoteStyles["note-pad-overflow-content"]}>
              {constructedformFieldComponents}
            </section>
          </section>
        )}
        {constructedformFieldComponents.length === 0 && (
          <section className={addNoteStyles["add-inputs-message"]}>
            <ul>
              <li>
                <PlusIcon />
              </li>
              <li>Please add inputs by clicking on below button</li>
            </ul>
          </section>
        )}

        <Fab
          color="primary"
          aria-label="add"
          className={commonStyles["floating-fab-bottom"]}
          onClick={() => {
            dispatch(
              setShowAddInputMenu({
                show: true,
                type: ADD_INPUT_MENU_TYPE.PARENT,
              }),
            );
            dispatch(
              setInputModifyInProgress({
                parentId: "",
                value: true,
                type: "add-new-field",
              }),
            );
          }}
        >
          <PlusIcon />
        </Fab>
        <Backdrop
          className={addNoteStyles["add-note-menu"]}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={addInputMenu.show}
          onClick={() => {
            dispatch(setShowAddInputMenu({ show: false }));
            dispatch(
              setInputModifyInProgress({
                parentId: "",
                value: false,
                type: "",
              }),
            );
          }}
        >
          {addInputMenu.type === ADD_INPUT_MENU_TYPE.CHILD && (
            <>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  dispatch(setModal({ value: true }));

                  const copyElemKey = inputModifyInfo.elemKey;
                  setTimeout(() => {
                    dispatch(
                      setInputModifyInProgress({
                        parentId: copyElemKey,
                        value: true,
                        type: "add-Tags",
                      }),
                    );
                  });
                }}
              >
                Tags
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
            </>
          )}

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

          <Button color="secondary" variant="contained" onClick={saveNote}>
            Save
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => dispatch(clearForm())}
          >
            Save As Draft
          </Button>
        </Backdrop>

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={showModal}
          onClose={() => {
            dispatch(
              setInputModifyInProgress({
                parentId: "",
                value: false,
                type: "",
              }),
            );
            dispatch(setModal({ value: false }));
          }}
          className={addNoteStyles["add-note-modal"]}
        >
          <ModalTagsContainer />
        </Modal>

        <Snackbar open={addNoteAPICallLoading}>
          <CircularProgress color="inherit" />
        </Snackbar>
      </main>
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
  date?: string | null;
  tags: TagsData[];
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
  date,
  tags,
}: NoteCatcherFormFieldType) => {
  const dispatch = useDispatch<AppDispatch>();

  const [style, setStyle] = useState({
    left: 50,
    width: 300,
  });
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
      setShowAddInputMenu({ show: true, type: ADD_INPUT_MENU_TYPE.CHILD }),
    );
    dispatch(
      setInputModifyInProgress({
        parentId: elemKey,
        value: true,
        type: "add-new-field",
      }),
    );
  };

  const inputFieldOnChange = (event: ChangeEvent<HTMLElement>) => {
    const { value } = (event.target || event.currentTarget) as HTMLInputElement;
    dispatch(fieldValueOnChange({ elemKey, value: value }));
  };

  const renderFormFieldBasedOnType = () => {
    switch (type) {
      case FORM_FIELD_INPUT_TYPES.INPUT: {
        return (
          <TextField
            style={{ width: `${style.width}px` }}
            label={label}
            multiline
            fullWidth
            value={value}
            onChange={(e) => inputFieldOnChange(e)}
          />
        );
      }

      case FORM_FIELD_INPUT_TYPES.IMAGE:
        return <CustomInputBox label={label} />;

      default:
        break;
    }
  };

  const MetaDataRendered = ({
    date,
    tags,
  }: {
    date?: string | null;
    tags: TagsData[];
  }) => {
    const [editDate, setEditDate] = useState(false);
    const [localDateValue, setLocalDateValue] = useState(date);

    const formatedDate = localDateValue
      ? moment(localDateValue).format(APP_DATE_TIME_FORMAT)
      : null;

    const dateTimeFieldOnChange = (
      currentlySelectedDateInfo: moment.Moment | null,
    ) => {
      if (currentlySelectedDateInfo) {
        const value = currentlySelectedDateInfo.format(APP_DATE_TIME_FORMAT);
        setLocalDateValue(value);
      }
    };

    return (
      <section className={addNoteStyles["input-meta-data"]}>
        {editDate && formatedDate && (
          <section className={addNoteStyles["edit-meta-data-date"]}>
            <ul>
              <li>
                <MobileDateTimePicker
                  onAccept={dateTimeFieldOnChange}
                  defaultValue={moment(formatedDate)}
                />
              </li>
              <li>
                <ul className={addNoteStyles["action-buttons"]}>
                  <li onClick={() => setEditDate(false)}>
                    <ClearIcon />
                  </li>
                  <li
                    onClick={() => {
                      dispatch(
                        fieldValueOnChange({
                          elemKey,
                          value: localDateValue || "",
                          isDateTime: true,
                        }),
                      );
                      setEditDate(false);
                    }}
                  >
                    <DoneIcon />
                  </li>
                </ul>
              </li>
            </ul>
          </section>
        )}
        <ul className={addNoteStyles["read-only-meta-data"]}>
          <li>
            {/* TODO: enable the tags edit feature */}
            {tags.map((t, index) => (
              <Chip
                className={addNoteStyles["chip-for-tags"]}
                key={index}
                label={t.name}
                variant="outlined"
              />
            ))}
          </li>
          {localDateValue && (
            <li className={addNoteStyles["date"]}>
              <ul>
                <li>{localDateValue}</li>
                <li onClick={() => setEditDate(true)}>
                  <EditIcon />
                </li>
              </ul>
            </li>
          )}
        </ul>
      </section>
    );
  };

  const openMenu = Boolean(anchorEl);

  return (
    <section
      className={addNoteStyles["formfield-holder"]}
      style={{
        marginLeft: `${style.left}px`,
      }}
    >
      <section className={addNoteStyles["field-container"]}>
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
        <section className={addNoteStyles["rendered-field-parent"]}>
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
      </section>
      <MetaDataRendered tags={tags} date={date} />
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

const GET_ALL_TAGS = gql(`
  query getAllTags (
    $size: Int,
    $page: Int,
  ) {
    tags(input: {
      batchSize: $size,
      page: $page
    }) {
      tags {
        key
        value {
          name
        }
      }
    }
  }
`);
const GET_TAGS_ON_SEARCH = gql(`
  query getTagsOnFilter (
    $size: Int,
    $page: Int,
    $tagsName: [String!],
  ) {
    tags(input: {
      batchSize: $size,
      page: $page,
      tagsName: $tagsName
    }) {
      tags {
        key
        value {
          name
        }
      }
    }
  }
`);

interface TagsDataWithSelector {
  key: string;
  name: string;
  selected: boolean;
}

const ModalTagsContainer = forwardRef(
  function ModalTagsContainerComponentFunc() {
    const {
      data: tagsData,
      loading: tagsLoading,
      error: tagsFetchError,
    } = useQuery(GET_ALL_TAGS);

    // TODO: show loading for the tags lazy fetch
    const [
      searchTags,
      {
        data: searchTagsData,
        loading: searchTagsLoading,
        error: searchTagsFetchError,
      },
    ] = useLazyQuery(GET_TAGS_ON_SEARCH);

    const searchFieldDebounceTimerRef: MutableRefObject<any> = useRef();

    const addNoteStoreState = useSelector(
      (state: RootState) => state.root.addNote,
    );

    // TODO: show the already attached tags
    const { inputModifyInfo, allTags, newTags } = addNoteStoreState;

    const dispatch = useDispatch<AppDispatch>();

    const normalizedTagsData: TagsDataWithSelector[] = [];
    const [tagsDataLocal, setTagsDataLocal] = useState(normalizedTagsData);

    useEffect(() => {
      if (tagsFetchError) dispatch(addNotifications(tagsFetchError.message));
    }, [tagsFetchError]);

    const initTagsData = () => {
      if (tagsData?.tags.tags) {
        const normalizedTagsData: TagsDataWithSelector[] = [];
        const allTags = tagsData?.tags.tags;
        for (let i = 0; i < allTags.length; ++i) {
          const curTag = allTags[i];
          normalizedTagsData.push({
            key: curTag.key,
            name: curTag.value.name || "",
            selected: false,
          });
        }

        setTagsDataLocal(normalizedTagsData);
      }
    };

    useEffect(() => {
      initTagsData();
    }, [tagsData]);

    return (
      <section className={addNoteStyles["modal-content"]}>
        <header>
          <h2 id="unstyled-modal-title" className="modal-title">
            Tags
          </h2>
        </header>
        <section className={addNoteStyles["tags-searcher"]}>
          <TextField
            label="Search Tags"
            variant="outlined"
            fullWidth
            color="secondary"
            focused
            onChange={(e) => {
              clearTimeout(searchFieldDebounceTimerRef.current);

              searchFieldDebounceTimerRef.current = setTimeout(() => {
                const searchedText = e.target.value;

                // TODO: correct the logic to add new
                if (searchedText) {
                  const curSearchedTags = tagsDataLocal.filter(
                    (t) => t.name.indexOf(searchedText) > -1,
                  );

                  if (curSearchedTags.length) {
                    setTagsDataLocal(curSearchedTags);
                  } else {
                    searchTags({
                      variables: { page: 0, size: 100, tagsName: [] },
                    });
                  }
                } else {
                  initTagsData();
                }
              }, 1000);
            }}
          />
        </section>
        <section className={addNoteStyles["tags-holder"]}>
          {tagsLoading && (
            <section className={addNoteStyles["loading-content"]}>
              <CircularProgress color="inherit" />
            </section>
          )}
          {tagsDataLocal.map((t) => {
            const { key, name, selected } = t;

            return (
              <Chip
                className={addNoteStyles["chip-for-tags"]}
                key={key}
                label={name}
                variant={selected ? "filled" : "outlined"}
                onClick={() => {
                  const tagsDataLocalReplica = [...tagsDataLocal];
                  for (let i = 0; i < tagsDataLocalReplica.length; ++i) {
                    const curTag = tagsDataLocalReplica[i];
                    if (curTag.key === key) {
                      curTag.selected = !curTag.selected;
                      break;
                    }
                  }

                  setTagsDataLocal(tagsDataLocalReplica);
                }}
              />
            );
          })}
        </section>
        <footer>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              const currentlySelectedTags = tagsDataLocal.filter(
                (t) => t.selected,
              );
              const currentAllTags = [...allTags, ...currentlySelectedTags];

              const currentNewlyAddedTags = currentlySelectedTags
                .filter((t) => !t.key)
                .map((t) => t.name);
              const currentNewTags = [...newTags, ...currentNewlyAddedTags];

              dispatch(
                setTagsForField({
                  elemKey: inputModifyInfo.elemKey,
                  tagsArray: currentAllTags,
                  newTags: currentNewTags,
                }),
              );
              dispatch(setModal({ value: false }));
              dispatch(
                setInputModifyInProgress({
                  parentId: "",
                  value: false,
                  type: "",
                }),
              );
            }}
          >
            Save
          </Button>
        </footer>
      </section>
    );
  },
);
