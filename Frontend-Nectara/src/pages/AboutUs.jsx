import TeamCard from "../components/TeamCard";

const AboutUs = () => {
  const team = [
    {
      name: "Angie Pereira",
      image: "/images-form/angie.jpg",
      bio: "Desarrolladora front-end apasionada por la conservación y la tecnología en África.",
      linkedin: "https://www.linkedin.com/in/anngy-pereira-094aa026a/",
      github: "https://github.com/angiepereir",
    },
    {
      name: "Ana Muruzabal",
      image: "/images-form/ana.jpg",
      bio: "Diseñadora UI/UX enfocada en biodiversidad y experiencias educativas.",
      linkedin: "https://www.linkedin.com/in/ana-muruzabal-1ab453209/",
      github: "https://github.com/AnaMuruzabal",
    },
    {
      name: "Sofía Reyes",
      image: "/images-form/sofia.jpg",
      bio: "Desarrolladora front-end apasionada por la conservación y la tecnología en África.",
      linkedin: "https://www.linkedin.com/in/sofiareyes12/",
      github: "https://github.com/Sofiareyes12",
    },
    {
      name: "Aday Alvarez",
      image: "/images-form/aday.jpg.webp",
      bio: "Diseñadora UI/UX enfocada en biodiversidad y experiencias educativas.",
      linkedin: "https://www.linkedin.com/in/adayasc/",
      github: "https://github.com/Aday25",
    },
  ];

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center py-16 px-6"
      style={{
        backgroundImage: "url('/image4.jpg')",
        backgroundColor: "#fdf9f6",
      }}
    >
      <h1
        className="text-5xl md:text-6xl mb-12 font-georgia text-center drop-shadow-md"
        style={{
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          background: "linear-gradient(to right, #c61e0f, #eb391d, #e66035)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Nuestro equipo
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {team.map((member, index) => (
          <TeamCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
