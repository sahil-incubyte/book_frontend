import { render, screen } from "@testing-library/react";

// Verifies the toolchain end to end: TS/JSX transform, jsdom, React Testing
// Library rendering, and the jest-dom matcher (toBeInTheDocument).
test("test toolchain renders a component", () => {
  render(<button>Click me</button>);
  expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
});
