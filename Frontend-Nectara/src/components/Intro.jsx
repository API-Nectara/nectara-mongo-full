const Intro = () => {
  return (
    <section className="w-full px-6 md:px-16 py-12 text-center drop-shadow-md">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-4xl md:text-5xl mb-6 font-georgia"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            background: "linear-gradient(to right, #c61e0f, #eb391d, #e66035)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Las Mariposas Africanas y su Rol Vital
        </h2>

        <p className="text-lg md:text-xl leading-relaxed font-georgia text-black">
          Las mariposas no solo embellecen el paisaje africano con sus colores vibrantes, sino que también juegan un papel fundamental en la polinización de plantas nativas. 
          Actúan como indicadores de biodiversidad y son esenciales para el mantenimiento de ecosistemas saludables. 
          En África, ayudan a sostener tanto cultivos como hábitats naturales, favoreciendo la reproducción de muchas especies vegetales.
        </p>
      </div>
    </section>
  );
};

export default Intro;
