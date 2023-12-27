import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import AddNote from "../pages/add-note";

import { pageTitles } from "../components/utils";

describe("Add Note", () => {
  it("renders the add note page", () => {
    render(<AddNote />);

    const pageText = screen.getByText(pageTitles.ADD_NOTE);

    expect(pageText).toBeInTheDocument();
  });
});
