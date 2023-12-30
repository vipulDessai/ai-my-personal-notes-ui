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
    addFieldToParent: (
      state,
      action: PayloadAction<{ parentId: string; newFieldId: string }>,
    ) => {
      const { parentId, newFieldId } = action.payload;

      // TODO: get element by parent id

      const noteCatcherField: NoteCatcherFieldsHierarchy = {
        key: newFieldId,
        // TODO - add label and level with proper value
        meta: {
          key: newFieldId,
          label: newFieldId,
          level: 0,
          type: "input",
        },
        childFields: [],
      };
      state.formFields.push(noteCatcherField);
    },
    removeField: (
      state,
      action: PayloadAction<{ parentId: string; newFieldId: string }>,
    ) => {},
    repositionField: (
      state,
      action: PayloadAction<{ parentId: string; newFieldId: string }>,
    ) => {},
  },
});

export const { addNewField, addFieldToParent, removeField, repositionField } =
  addNoteSlice.actions;

export const addNoteSliceReducer = addNoteSlice.reducer;
