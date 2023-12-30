import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import AddNote from "../pages/add-note";
import { useSelector } from "../__mocks__/react-redux";

describe("Add Note", () => {
  it("renders the add note page", () => {
    useSelector.mockImplementation(() => []);

    render(<AddNote />);

    const pageText = screen.getByRole("button", {
      name: /add/i,
    });

    expect(pageText).toBeInTheDocument();
  });
});
