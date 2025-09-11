import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "../components/Footer";

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test("renders Footer with logo", () => {
    const logo = screen.getByAltText(/Logo Factoria F5/i);
    expect(logo).toBeDefined();
  });

  test("renders project description text", () => {
    const projectText = screen.getByText(/Proyecto creado por grupo P4 Femcoders Factoria F5/i);
    expect(projectText).toBeDefined();
  });

  test("renders copyright text", () => {
    const copyrightText = screen.getByText(/© 2025 Nectara/i);
    expect(copyrightText).toBeDefined();
  });

  test("renders clickable info link", () => {
    const infoLink = screen.getByText(/\+ info/i);
    expect(infoLink).toBeDefined();
  });

  
});