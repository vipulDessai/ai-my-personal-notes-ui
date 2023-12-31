import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { FORM_FIELD_REPOSE_DIRECTION, generateUUID } from "../../utils";

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
}

export interface InputModifyInfoType {
  inProgress: boolean;
  elemKey: string;
  actionType: "" | "resize" | "reposition";
}

interface AddNoteState {
  inputModifyInfo: InputModifyInfoType;
  formFields: NoteCatcherFieldsHierarchy[];
}

const initialState: AddNoteState = {
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
    addNewField: (state) => {
      const elemKey = generateUUID();

      const noteCatcherField: NoteCatcherFieldsHierarchy = {
        key: elemKey,
        meta: {
          key: elemKey,
          type: "input",
          repositionElement: false,
          resizeElement: false,
        },
        childFields: [],
      };
      state.formFields.push(noteCatcherField);
    },
    addFieldToParent: (state, action: PayloadAction<{ parentId: string }>) => {
      const { parentId } = action.payload;
      const childElemKey = generateUUID();

      findElemAndPerformOperation(
        parentId,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          currentFormFieldsList: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          const noteCatcherField: NoteCatcherFieldsHierarchy = {
            key: childElemKey,
            meta: {
              key: childElemKey,
              type: "input",
              repositionElement: false,
              resizeElement: false,
            },
            childFields: [],
          };

          currentFormFieldsList[index].childFields.push(noteCatcherField);
        },
      );
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
                // try to select the upper sibling node
                index--;
                while (index >= 0) {
                  // check if any upper node is NOT null
                  if (currentFormFieldsList[index]) {
                    const tmpCurElem = currentFormFieldsList.splice(index, 1);

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
  },
});

export const {
  addNewField,
  addFieldToParent,
  removeField,
  repositionField,
  setRepositionElement,
  setResizeElement,
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
