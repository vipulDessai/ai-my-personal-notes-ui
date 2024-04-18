import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

import {
  APP_DATE_TIME_FORMAT,
  FORM_FIELD_INPUT_TYPES,
  FORM_FIELD_REPOSE_DIRECTION,
  generateUUID,
} from "../../utils";

export interface InputFieldInfo {
  type: string;
  key: string;
  repositionElement: boolean;
  resizeElement: boolean;
  tags: string[];
}

interface NoteCatcherFieldsHierarchy {
  key: string;
  meta: InputFieldInfo;
  childFields: NoteCatcherFieldsHierarchy[];
  value: string;
}

export interface InputModifyInfoType {
  inProgress: boolean;
  elemKey: string;
  actionType: "" | "resize" | "reposition" | "add-new-field" | "add-Tags";
}

export enum ADD_INPUT_MENU_TYPE {
  PARENT,
  CHILD,
}

interface AddNoteState {
  addInputMenu: {
    show: boolean;
    type: ADD_INPUT_MENU_TYPE;
  };
  showModal: boolean;
  inputModifyInfo: InputModifyInfoType;
  formFields: NoteCatcherFieldsHierarchy[];
  title: string;
  date: string;
  allTags: string[];
  newTags: string[];
}

export const initialState: AddNoteState = {
  addInputMenu: {
    show: false,
    type: ADD_INPUT_MENU_TYPE.PARENT,
  },
  showModal: false,
  inputModifyInfo: {
    inProgress: false,
    elemKey: "",
    actionType: "",
  },
  formFields: [],
  title: "",
  date: "",
  allTags: [],
  newTags: [],
};

export const addNoteSlice = createSlice({
  name: "add-note",
  initialState,
  reducers: {
    setShowAddInputMenu: (
      state,
      action: PayloadAction<{
        show: boolean;
        type?: ADD_INPUT_MENU_TYPE;
      }>,
    ) => {
      const { show, type } = action.payload;

      if (show) {
        state.addInputMenu.show = show;

        if (type) state.addInputMenu.type = type;
      } else {
        state.addInputMenu.show = false;
        state.addInputMenu.type = ADD_INPUT_MENU_TYPE.PARENT;
      }
    },
    setModal: (
      state,
      action: PayloadAction<{
        value: boolean;
      }>,
    ) => {
      const { value } = action.payload;
      state.showModal = value;
    },
    setInputModifyInProgress: (
      state,
      action: PayloadAction<{
        parentId: string;
        value: boolean;
        type: ReturnType<() => InputModifyInfoType["actionType"]>;
      }>,
    ) => {
      const { parentId, value, type } = action.payload;

      if (value) {
        state.inputModifyInfo = {
          actionType: type,
          elemKey: parentId,
          inProgress: true,
        };
      } else {
        state.inputModifyInfo = {
          actionType: "",
          elemKey: "",
          inProgress: false,
        };
      }
    },
    addNewField: (state, action: PayloadAction<{ type: string }>) => {
      const { type } = action.payload;
      const {
        inProgress,
        actionType,
        elemKey: parentId,
      } = state.inputModifyInfo;

      const elemKey = generateUUID();
      let noteCatcherField: NoteCatcherFieldsHierarchy;
      switch (type) {
        case FORM_FIELD_INPUT_TYPES.INPUT:
          {
            noteCatcherField = {
              key: elemKey,
              meta: {
                key: elemKey,
                type: FORM_FIELD_INPUT_TYPES.INPUT,
                repositionElement: false,
                resizeElement: false,
                tags: [],
              },
              childFields: [],
              value: "",
            };
          }

          break;

        case FORM_FIELD_INPUT_TYPES.IMAGE:
          {
            noteCatcherField = {
              key: elemKey,
              meta: {
                key: elemKey,
                type: FORM_FIELD_INPUT_TYPES.IMAGE,
                repositionElement: false,
                resizeElement: false,
                tags: [],
              },
              childFields: [],
              value: "",
            };
          }

          break;

        case FORM_FIELD_INPUT_TYPES.DATE_AND_TIME:
          {
            const defaultValue = moment().format(APP_DATE_TIME_FORMAT);

            noteCatcherField = {
              key: elemKey,
              meta: {
                key: elemKey,
                type: FORM_FIELD_INPUT_TYPES.DATE_AND_TIME,
                repositionElement: false,
                resizeElement: false,
                tags: [],
              },
              childFields: [],
              value: defaultValue,
            };
          }

          break;

        default:
          noteCatcherField = {
            key: elemKey,
            meta: {
              key: elemKey,
              type: FORM_FIELD_INPUT_TYPES.INPUT,
              repositionElement: false,
              resizeElement: false,
              tags: [],
            },
            childFields: [],
            value: "",
          };
          break;
      }

      if (inProgress && actionType === "add-new-field" && parentId) {
        findElemAndPerformOperation(
          parentId,
          null,
          state.formFields,
          (
            parentField: NoteCatcherFieldsHierarchy[] | null,
            currentFormFieldsList: NoteCatcherFieldsHierarchy[],
            index: number,
          ) => {
            currentFormFieldsList[index].childFields.push(noteCatcherField);
          },
        );
      } else {
        state.formFields.push(noteCatcherField);
      }

      state.addInputMenu.show = false;
      state.addInputMenu.type = ADD_INPUT_MENU_TYPE.PARENT;

      state.inputModifyInfo = {
        inProgress: false,
        elemKey: "",
        actionType: "",
      };
    },
    removeField: (state, action: PayloadAction<{ elemKey: string }>) => {
      findElemAndPerformOperation(
        action.payload.elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          currentFormFieldsList: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          currentFormFieldsList.splice(index, 1);
        },
      );
    },
    repositionField: (
      state,
      action: PayloadAction<{ elemKey: string; direction: string }>,
    ) => {
      const { elemKey, direction } = action.payload;

      findElemAndPerformOperation(
        elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          currentFormFieldsList: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          switch (direction) {
            case FORM_FIELD_REPOSE_DIRECTION.UP:
              {
                const tmpCurElemIndex = index;

                index--;
                do {
                  if (currentFormFieldsList[index]) {
                    const tmpCurElem = currentFormFieldsList.splice(
                      tmpCurElemIndex,
                      1,
                    );

                    currentFormFieldsList.splice(index, 0, tmpCurElem[0]);
                    break;
                  }

                  index--;
                } while (index >= 0);
              }

              break;

            case FORM_FIELD_REPOSE_DIRECTION.LEFT:
              {
                if (parentField) {
                  const tmpCurElem = currentFormFieldsList.splice(index, 1);
                  parentField.push(tmpCurElem[0]);
                }
              }

              break;

            case FORM_FIELD_REPOSE_DIRECTION.RIGHT:
              {
                const tmpCurElemIndex = index;
                // try to select the upper sibling node
                index--;
                while (index >= 0) {
                  // check if any upper node is NOT null
                  if (currentFormFieldsList[index]) {
                    const tmpCurElem = currentFormFieldsList.splice(
                      tmpCurElemIndex,
                      1,
                    );

                    currentFormFieldsList[index].childFields.push(
                      tmpCurElem[0],
                    );

                    break;
                  }

                  index--;
                }
              }

              break;

            case FORM_FIELD_REPOSE_DIRECTION.DOWN:
              {
                const tmpCurElemIndex = index;

                index++;
                do {
                  if (currentFormFieldsList[index]) {
                    const tmpCurElem = currentFormFieldsList.splice(
                      tmpCurElemIndex,
                      1,
                    );

                    currentFormFieldsList.splice(index, 0, tmpCurElem[0]);
                    break;
                  }

                  index++;
                } while (index <= currentFormFieldsList.length - 1);
              }

              break;

            default:
              break;
          }
        },
      );
    },
    setRepositionElement: (
      state,
      action: PayloadAction<{ elemKey: string; value: boolean }>,
    ) => {
      const { elemKey, value } = action.payload;

      state.inputModifyInfo = {
        inProgress: value,
        elemKey: value ? elemKey : "",
        actionType: value ? "reposition" : "",
      };

      findElemAndPerformOperation(
        elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          currentFormFieldsList: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          currentFormFieldsList[index].meta.repositionElement = value;
        },
      );
    },
    setResizeElement: (
      state,
      action: PayloadAction<{ elemKey: string; value: boolean }>,
    ) => {
      const { elemKey, value } = action.payload;

      state.inputModifyInfo = {
        inProgress: value,
        elemKey: value ? elemKey : "",
        actionType: value ? "resize" : "",
      };

      findElemAndPerformOperation(
        elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          currentFormFieldsList: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          currentFormFieldsList[index].meta.resizeElement = value;
        },
      );
    },
    fieldValueOnChange: (
      state,
      action: PayloadAction<{ elemKey: string; value: string }>,
    ) => {
      const { elemKey, value } = action.payload;
      findElemAndPerformOperation(
        elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          currentFormFieldsList: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          currentFormFieldsList[index].value = value;
        },
      );
    },
    clearForm: (state) => {
      state.formFields = [];
    },
    setTitle: (state, action: PayloadAction<{ value: string }>) => {
      state.title = action.payload.value;
    },
    setNoteDateTime: (state, action: PayloadAction<{ value: string }>) => {
      state.date = action.payload.value;
    },
  },
});

export const {
  setShowAddInputMenu,
  setModal,
  setInputModifyInProgress,
  addNewField,
  removeField,
  repositionField,
  setRepositionElement,
  setResizeElement,
  fieldValueOnChange,
  clearForm,
  setTitle,
  setNoteDateTime,
} = addNoteSlice.actions;

export const addNoteSliceReducer = addNoteSlice.reducer;

// TODO: prevFormFields always points to the root element
const findElemAndPerformOperation = (
  key: string,
  prevFormFields: NoteCatcherFieldsHierarchy[] | null,
  formFields: NoteCatcherFieldsHierarchy[],
  cb: any,
) => {
  for (let i = 0; i < formFields.length; i++) {
    const elem = formFields[i];

    if (elem) {
      if (elem.key === key) {
        cb(prevFormFields, formFields, i);
        return;
      }

      findElemAndPerformOperation(key, formFields, elem.childFields, cb);
    }
  }
};
