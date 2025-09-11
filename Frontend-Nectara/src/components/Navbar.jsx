import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const base = "/init";

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 text-[#cdbfbc] shadow-md backdrop-blur-md"
        style={{
          backgroundColor: "rgba(27, 72, 87, 0.9)",
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl tracking-wide hover:text-[#eb391d] transition"
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
            }}
          >
            Nectara
          </Link>

          {/* Hamburguesa */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Enlaces (desktop) */}
          <div className="space-x-6 hidden md:flex">
            {["Inicio", "Agregar", "Ver Galería", "Cuaderno de Campo", "Contacto", "Creadoras"].map(
              (label, index) => {
                const paths = [
                  `${base}`,
                  `${base}/newbutterfly`,
                  `${base}/galery`,
                  `${base}/butterflydetail/1`, // Usando ruta existente con ID por defecto
                  `${base}/contact`,
                  `${base}/about`,
                ];
                return (
                  <Link
                    key={label}
                    to={paths[index]}
                    className="hover:text-[#e66035] transition"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: "normal",
                    }}
                  >
                    {label}
                  </Link>
                );
              }
            )}
          </div>
        </div>

        {/* Enlaces (mobile) */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 flex flex-col bg-[#1b4857]">
            {["Inicio", "Agregar", "Ver Galería", "Cuaderno de Campo", "Contacto", "Creadoras"].map(
              (label, index) => {
                const paths = [
                  `${base}`,
                  `${base}/newbutterfly`,
                  `${base}/galery`,
                  `${base}/butterflydetail/1`, // Usando ruta existente con ID por defecto
                  `${base}/contact`,
                  `${base}/about`,
                ];
                return (
                  <Link
                    key={label}
                    to={paths[index]}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-[#e66035] transition"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: "normal",
                    }}
                  >
                    {label}
                  </Link>
                );
              }
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;