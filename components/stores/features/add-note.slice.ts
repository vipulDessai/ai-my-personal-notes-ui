import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { FORM_FIELD_REPOSE_DIRECTION, generateUUID } from "../../utils";

export interface InputFieldInfo {
  type: string;
  label: string;
  level: number;
  key: string;
  repositionElement: boolean;
  resizeElement: boolean;
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
          elem: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          const noteCatcherField: NoteCatcherFieldsHierarchy = {
            key: childElemKey,
            // TODO - add label and level with proper value
            meta: {
              key: childElemKey,
              label: childElemKey,
              level: 0,
              type: "input",
              repositionElement: false,
              resizeElement: false,
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
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          elem: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          // TODO: see why a null is added when deleting the node
          delete elem[index];
        },
      );
    },
    repositionField: (
      state,
      action: PayloadAction<{ elemKey: string; direction: string }>,
    ) => {
      findElemAndPerformOperation(
        action.payload.elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          elem: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          switch (action.payload.direction) {
            case FORM_FIELD_REPOSE_DIRECTION.UP:
              break;

            case FORM_FIELD_REPOSE_DIRECTION.LEFT:
              {
                if (parentField) {
                  const tmpCurElem = { ...elem[index] };
                  parentField.push(tmpCurElem);
                  delete elem[index];
                }
              }

              break;

            case FORM_FIELD_REPOSE_DIRECTION.RIGHT:
              {
                const tmpCurElem = { ...elem[index] };
                const tmpCurElemRef = index;

                // try to select the upper sibling node
                index--;
                while (index >= 0) {
                  // check if any upper node is NOT null
                  if (elem[index]) {
                    elem[index].childFields.push(tmpCurElem);
                    delete elem[tmpCurElemRef];

                    break;
                  }

                  index--;
                }
              }

              break;

            case FORM_FIELD_REPOSE_DIRECTION.DOWN:
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
      findElemAndPerformOperation(
        action.payload.elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          elem: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          elem[index].meta.repositionElement = action.payload.value;
        },
      );
    },
    setResizeElement: (
      state,
      action: PayloadAction<{ elemKey: string; value: boolean }>,
    ) => {
      findElemAndPerformOperation(
        action.payload.elemKey,
        null,
        state.formFields,
        (
          parentField: NoteCatcherFieldsHierarchy[],
          elem: NoteCatcherFieldsHierarchy[],
          index: number,
        ) => {
          elem[index].meta.resizeElement = action.payload.value;
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
