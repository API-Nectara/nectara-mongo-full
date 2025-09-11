import { motion } from "framer-motion";
import "./CollageBackground.css";

export default function CollageBackground() {
  const floating = {
    y: [0, -10, 0], // sube y baja
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="collage-container">
      {/* Textura de papel vintage */}
      <div className="paper-texture" />

      {/* Elementos flotantes */}
      <motion.img
        src="/images/butterfly1.png"
        alt="Butterfly 1"
        className="collage-item butterfly"
        animate={floating}
        style={{ top: "10%", left: "15%" }}
      />

      <motion.img
        src="/images/stamp1.png"
        alt="Stamp 1"
        className="collage-item stamp"
        animate={floating}
        style={{ top: "40%", left: "70%" }}
      />

      <motion.img
        src="/images/butterfly2.png"
        alt="Butterfly 2"
        className="collage-item butterfly"
        animate={floating}
        style={{ top: "65%", left: "25%" }}
      />
    </div>
  );
}
