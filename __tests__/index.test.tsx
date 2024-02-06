import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Home from "../pages/index";

import { useRouter } from "../__mocks__/next/router";

jest.mock("../components/Header");

describe("Home", () => {
  it("renders a heading", () => {
    // TODO: remove this meaning less mocker test 😁
    useRouter.mockImplementation(() => [{ foo: "bar" }]);

    render(<Home />);

    const pageText = screen.getByText("Home");

    expect(pageText).toBeInTheDocument();
  });
});
