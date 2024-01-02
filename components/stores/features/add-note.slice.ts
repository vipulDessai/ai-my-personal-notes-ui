import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { generateUUID } from "../../utils";

export interface InputFieldInfo {
  type: string;
  label: string;
  level: number;
  key: string;
}

interface NoteCatcherFieldsHierarchy {
  key: string;
  meta: InputFieldInfo;
  childFields: NoteCatcherFieldsHierarchy[];
}

interface AddNoteState {
  formFields: NoteCatcherFieldsHierarchy[];
}

const initialState: AddNoteState = {
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
        // TODO - add label and level with proper value
        meta: {
          key: elemKey,
          label: elemKey,
          level: 0,
          type: "input",
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
        state.formFields,
        (elem: NoteCatcherFieldsHierarchy[], index: number) => {
          const noteCatcherField: NoteCatcherFieldsHierarchy = {
            key: childElemKey,
            // TODO - add label and level with proper value
            meta: {
              key: childElemKey,
              label: childElemKey,
              level: 0,
              type: "input",
            },
            childFields: [],
          };

          elem[index].childFields.push(noteCatcherField);
        },
      );
    },
    removeField: (state, action: PayloadAction<{ elemKey: string }>) => {
      findElemAndPerformOperation(
        action.payload.elemKey,
        state.formFields,
        (elem: NoteCatcherFieldsHierarchy[], index: number) => {
          // TODO: see why a null is added when deleting the node
          delete elem[index];
        },
      );
    },
    repositionField: (
      state,
      action: PayloadAction<{ parentId: string; newFieldId: string }>,
    ) => {},
  },
});

export const { addNewField, addFieldToParent, removeField, repositionField } =
  addNoteSlice.actions;

export const addNoteSliceReducer = addNoteSlice.reducer;

const findElemAndPerformOperation = (
  key: string,
  formFields: NoteCatcherFieldsHierarchy[],
  cb: any,
) => {
  for (let i = 0; i < formFields.length; i++) {
    const elem = formFields[i];

    if (elem) {
      if (elem.key === key) {
        cb(formFields, i);
        return;
      }

      findElemAndPerformOperation(key, elem.childFields, cb);
    }
  }
};
