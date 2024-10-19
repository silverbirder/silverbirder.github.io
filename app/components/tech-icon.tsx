"use client";

import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export const TechIcon = ({ skill }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleIconClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={iconRef}>
      <button
        onClick={handleIconClick}
        className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <skill.icon className="w-8 h-8" />
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
            <skill.icon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">{skill.name}</h2>
        </div>
        <h3 className="text-lg leading-[3rem] font-semibold">ヒトコト</h3>
        <p className="text-base mb-4">{skill.description}</p>
      </Modal>
    </div>
  );
};
