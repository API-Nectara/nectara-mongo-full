import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  test("renders Navbar with NECTARA title", () => {
    const showTitle = screen.getByText(/NECTARA/i);
    expect(showTitle).toBeDefined();
  });

  test("renders all navigation links", () => {
    const inicioLink = screen.getByText(/Inicio/i);
    const agregarLink = screen.getByText(/Agregar/i);
    const galeriaLink = screen.getByText(/Ver Galería/i);
    
    expect(inicioLink).toBeDefined();
    expect(agregarLink).toBeDefined();
    expect(galeriaLink).toBeDefined();
  });

  test("renders hamburger menu button", () => {
    const hamburgerButton = screen.getByRole("button");
    expect(hamburgerButton).toBeDefined();
  });

  test("toggles mobile menu when button is clicked", () => {
    const hamburgerButton = screen.getByRole("button");
    fireEvent.click(hamburgerButton);
    
    const mobileLinks = screen.getAllByText(/Inicio/i);
    expect(mobileLinks.length).toBeGreaterThan(1);
  });
});