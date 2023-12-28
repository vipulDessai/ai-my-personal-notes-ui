import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import AddNote from "../pages/add-note";

describe("Add Note", () => {
  it("renders the add note page", () => {
    render(<AddNote />);

    const pageText = screen.getByRole("button", {
      name: /add/i,
    });

    expect(pageText).toBeInTheDocument();
  });
});
