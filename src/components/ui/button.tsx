"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({ text, onClick, type = "submit" ,className}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-full px-5 py-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl"
    >
      {text}
    </motion.button>
  );
}
