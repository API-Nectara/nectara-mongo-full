import { useEffect, useState } from "react";
import { getAllButterflies } from "../services/ButterflyServices";
import { Link } from "react-router-dom";

const ButterflyGalery = () => {
  const [butterflies, setButterflies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchButterflies = async () => {
      try {
        const data = await getAllButterflies();
        setButterflies(data);
      } catch (error) {
        console.error("Error al cargar las mariposas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchButterflies();
  }, []);

  return (
    <div
  className="min-h-screen bg-fixed bg-cover bg-center"
  style={{
    backgroundImage: "url('/image4.jpg')",
    backgroundColor: "#fdf9f6",
  }}
>
      {/* Header con gradiente y efectos */}
      <div className="relative py-16 px-6">
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-teal-700/10"
          style={{
            background: "linear-gradient(to right, #c61e0f15, #216b8115)",
          }}
        ></div>
        <div className="relative text-center">
          <h2
            className="text-5xl md:text-6xl mb-4"
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
              background:
                "linear-gradient(to right, #c61e0f, #eb391d, #e66035)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Galería de Mariposas
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: "#010608ff",
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
            }}
          >
            Descubre la belleza y diversidad del mundo de las mariposas
          </p>
        </div>
      </div>

      <div className="px-6 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div
                className="w-16 h-16 border-4 rounded-full animate-spin"
                style={{ borderColor: "#cdbfbc", borderTopColor: "#e66035" }}
              ></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin animate-reverse"
                style={{ borderRightColor: "#eb391d" }}
              ></div>
            </div>
            <p
              className="text-xl mt-6 animate-pulse"
              style={{ color: "#1b4857" }}
            >
              Cargando mariposas mágicas...
            </p>
          </div>
        ) : butterflies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🦋</div>
            <p className="text-xl" style={{ color: "#1b4857" }}>
              No hay mariposas registradas.
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {butterflies.map((butterfly, index) => (
                <div
                  key={butterfly.id}
                  className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    backgroundColor: "#ffffff",
                    border: "1px solid #cdbfbc40",
                  }}
                >
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Contenedor de imagen */}
                  <div className="relative overflow-hidden h-48">
                    {butterfly.image && (
                      <img
                        src={butterfly.image}
                        alt={butterfly.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}

                    {/* Overlay gradiente */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, #0a181880, transparent)",
                      }}
                    ></div>

                    {/* Efecto de mariposa flotante */}
                    <div className="absolute top-3 right-3 text-2xl opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:animate-bounce">
                      🦋
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 relative">
                    <h3
                      className="text-xl font-bold mb-3 transition-colors duration-300"
                      style={{
                        color: "#0a1818",
                        fontFamily: "Georgia, serif",
                        fontWeight: "normal",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#e66035")}
                      onMouseLeave={(e) => (e.target.style.color = "#0a1818")}
                    >
                      {butterfly.common_name}
                    </h3>

                    <p
                      className="text-sm mb-4 line-clamp-3 leading-relaxed"
                      style={{
                        color: "#1b4857",
                        fontFamily: "Georgia, serif",
                        fontWeight: "normal",
                      }}
                    >
                      {butterfly.description}
                    </p>

                    {/* Link */}

                    <Link
                      to={`/init/butterflydetail/${butterfly.id}`}
                        className="butterfly-button"

                      style={{
                        fontFamily: "Georgia, serif",
                        fontWeight: "normal",
                        fontSize: "0.95rem",
                        color: "#e66035",
                        border: "1px solid #e66035",
                        padding: "0.5rem 1.25rem",
                        display: "inline-block",
                        width: "100%",
                        textAlign: "center",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        backgroundColor: "transparent",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#e66035";
                        e.target.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#e66035";
                      }}
                    >
                      Ver Detalle
                    </Link>
                  </div>

                  {/* Borde decorativo */}
                  <div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, #e6603520, #216b8120, #eb391d20)",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "#e6603510" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "#216b8110", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-48 h-48 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: "#82939d10", animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  );
};

export default ButterflyGalery;