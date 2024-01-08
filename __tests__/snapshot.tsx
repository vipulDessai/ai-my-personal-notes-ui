import { render } from "@testing-library/react";

import Home from "../pages/index";
import AddNote from "../pages/add-note";

import { useSelector } from "../__mocks__/react-redux";
import { useRouter } from "../__mocks__/next/router";

it("renders homepage unchanged", () => {
  // TODO: remove this meaning less mocker test 😁
  useRouter.mockImplementation(() => [{ foo: "bar" }]);

  const { container } = render(<Home />);
  expect(container).toMatchSnapshot();
});

it("renders add note unchanged", () => {
  useSelector.mockImplementation(() => ({ formFields: [] }));

  const { container } = render(<AddNote />);
  expect(container).toMatchSnapshot();
});
