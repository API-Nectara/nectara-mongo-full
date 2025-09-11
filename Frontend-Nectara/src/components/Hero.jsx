import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="w-full py-16 px-6 md:px-40 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1 text-center md:text-left drop-shadow-md">
        <h2
          className="text-5xl md:text-6xl mb-6 leading-tight font-georgia"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            background: "linear-gradient(to right, #c61e0f, #eb391d, #e66035)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Explora el mundo de las mariposas africanas
        </h2>

        <p
          className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-georgia text-black"
        >
          Descubre sus colores, hábitats y la magia que aportan al ecosistema.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/init/galery"
            className="butterfly-button font-georgia"
          >
            Ver Galería de Mariposas
          </Link>

          <Link
            to="/init/butterflydetail/1"
            className="butterfly-button-outline font-georgia"
          >
            Descubre nuestra experiencia de libro de campo
          </Link>
        </div>
      </div>
    </section>
  );
}
