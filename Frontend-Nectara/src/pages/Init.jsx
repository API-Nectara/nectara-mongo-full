
import Hero from "../components/Hero";
import Intro from "../components/Intro";

const Init = () => {
  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/image4.jpg')",
        backgroundColor: "#fdf9f6",
      }}
    >
      <Hero />
      <Intro />
    </div>
  );
};

export default Init;
