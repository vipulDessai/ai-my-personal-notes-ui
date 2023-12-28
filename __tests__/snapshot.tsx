import { render } from "@testing-library/react";

import Home from "../pages/index";
import AddNote from "../pages/add-note";

it("renders homepage unchanged", () => {
  const { container } = render(<Home />);
  expect(container).toMatchSnapshot();
});

it("renders add note unchanged", () => {
  const { container } = render(<AddNote />);
  expect(container).toMatchSnapshot();
});
