"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ExternalLink, X, ZoomIn } from "lucide-react";
import { createPortal } from "react-dom";

export const EnhancedImage = ({
  src,
  alt,
  href = "",
  width,
  height,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleKeyDown, handleClickOutside]);

  const imageComponent = (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg object-contain cursor-pointer mx-auto my-6 ${className}`}
        onClick={toggleModal}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <ZoomIn className="text-white w-8 h-8" />
        <span className="text-white text-sm ml-2">タップして拡大</span>
      </div>
    </div>
  );

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative"
      >
        <button
          onClick={toggleModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <img
          src={src}
          alt={alt ?? src}
          width={width}
          height={height}
          className="object-contain my-6 mx-auto"
          loading="lazy"
        />
        {alt && <p className="mt-6 text-center text-base">{alt}</p>}
      </div>
    </div>
  );

  return (
    <figure className="my-6">
      {imageComponent}
      {isOpen && createPortal(modalContent, document.body)}
      {alt && (
        <figcaption className="my-0 flex flex-row gap-2 items-center justify-center text-center text-base">
          <span>{alt}</span>
          {href && (
            <a
              href={href}
              className="h-6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={18} className="h-6" />
            </a>
          )}
        </figcaption>
      )}
    </figure>
  );
};
