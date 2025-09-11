import { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Gracias por tu mensaje. Nos pondremos en contacto pronto.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section
      className="bg-fixed bg-cover bg-center px-6 md:px-12 py-20"
      style={{
        backgroundImage: "url('/image4.jpg')",
        backgroundColor: "#fdf9f6",
        fontFamily: "Georgia, serif",
        fontWeight: "normal",
      }}
    >
      <div className="max-w-3xl mx-auto text-center text-black drop-shadow-md">
        <h2
          className="text-5xl md:text-6xl mb-4 font-georgia"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: "normal",
            background: "linear-gradient(to right, #c61e0f, #eb391d, #e66035)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Contacta con las Creadoras
        </h2>
        <p className="mb-8 font-georgia">
          ¿Tienes preguntas, sugerencias o deseas colaborar con nosotras?
          ¡Escríbenos!
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 text-left bg-white bg-opacity-90 p-6 rounded-xl shadow-md"
        >
          <div>
            <label className="block mb-1 text-sm text-gray-600">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">Mensaje</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            ></textarea>
          </div>
          <button type="submit" className="butterfly-button mt-2">
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
