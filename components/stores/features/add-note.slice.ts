import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  FORM_FIELD_INPUT_TYPES,
  FORM_FIELD_REPOSE_DIRECTION,
  generateUUID,
} from "../../utils";

export interface InputFieldInfo {
  type: string;
  key: string;
  repositionElement: boolean;
  resizeElement: boolean;
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
  actionType: "" | "resize" | "reposition" | "add-new-field";
}

interface AddNoteState {
  showAddInputMenu: boolean;
  inputModifyInfo: InputModifyInfoType;
  formFields: NoteCatcherFieldsHierarchy[];
}

const initialState: AddNoteState = {
  showAddInputMenu: false,
  inputModifyInfo: {
    inProgress: false,
    elemKey: "",
    actionType: "",
  },
  formFields: [],
};

export const addNoteSlice = createSlice({
  name: "add-note",
  initialState,
  reducers: {
    setShowAddInputMenu: (
      state,
      action: PayloadAction<{ parentId: string; value: boolean }>,
    ) => {
      const { parentId, value } = action.payload;

      if (value) {
        state.showAddInputMenu = true;
        state.inputModifyInfo = {
          actionType: "add-new-field",
          elemKey: parentId,
          inProgress: true,
        };
      } else {
        state.showAddInputMenu = false;
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
              },
              childFields: [],
              value: "",
            };
          }

          break;

        case FORM_FIELD_INPUT_TYPES.DATE_AND_TIME:
          {
            noteCatcherField = {
              key: elemKey,
              meta: {
                key: elemKey,
                type: FORM_FIELD_INPUT_TYPES.DATE_AND_TIME,
                repositionElement: false,
                resizeElement: false,
              },
              childFields: [],
              value: "",
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

      state.showAddInputMenu = false;
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
    saveForm: (state) => {
      state.formFields = [];
    },
  },
});

export const {
  setShowAddInputMenu,
  addNewField,
  removeField,
  repositionField,
  setRepositionElement,
  setResizeElement,
  fieldValueOnChange,
  saveForm,
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
