import { motion } from "framer-motion";

const TeamModal = ({ name, bio, linkedin, github, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full text-center relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 butterfly-button text-sm"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#e66035] mb-2">{name}</h2>
        <p className="text-gray-700 mb-4">{bio}</p>
        <div className="flex justify-center gap-4">
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="butterfly-button">
            LinkedIn
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" className="butterfly-button">
            GitHub
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamModal;
