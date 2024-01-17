import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import AddNote from "../pages/add-note";
import { useSelector, useDispatch } from "../__mocks__/react-redux";

import { initialState as addNoteStoreState } from "../components/stores";

describe("Add Note", () => {
  it("renders the add note page", () => {
    useSelector.mockImplementation(() => ({ ...addNoteStoreState }));
    useDispatch.mockImplementation(() => {
      return () => {};
    });

    addNoteStoreState;

    render(<AddNote />);

    const pageText = screen.getByRole("button", {
      name: /add/i,
    });

    expect(pageText).toBeInTheDocument();
  });
});
