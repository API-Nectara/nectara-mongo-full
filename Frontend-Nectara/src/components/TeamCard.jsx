import { useState } from "react";
import TeamModal from "./TeamModal";
import { motion } from "framer-motion";

const TeamCard = ({ name, image, bio, linkedin, github }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white shadow-lg border border-orange-200 rounded-xl p-10 text-center text-xl flex flex-col items-center transition duration-300"
      >
        {/* Imagen del perfil */}
        <img
          src={image}
          alt={name}
          className="w-50 h-50 rounded-full mb-6 object-cover border-4 border-[#e66035]"
        />

        {/* Nombre */}
        <h3 className="text-lg font-semibold text-[#e66035] mb-2">{name}</h3>

        {/* Botón Ver más */}
        <button
          onClick={() => setOpen(true)}
          className="butterfly-button"
        >
          Ver más
        </button>
      </motion.div>

      {/* Modal */}
      {open && (
        <TeamModal
          name={name}
          bio={bio}
          linkedin={linkedin}
          github={github}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default TeamCard;

