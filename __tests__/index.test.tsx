import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Home from "../pages/index";

import { useRouter } from "../__mocks__/next/router";

describe("Home", () => {
  it("renders a heading", () => {
    useRouter.mockImplementation(() => [{ foo: "bar" }]);

    render(<Home />);

    const pageText = screen.getByText("Home");

    expect(pageText).toBeInTheDocument();
  });
});
