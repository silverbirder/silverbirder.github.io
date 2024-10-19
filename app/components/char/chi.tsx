"use client";

import { motion } from "framer-motion";

type Props = {
  className?: string;
  startDelay?: number;
  duration?: number;
};

export default function Component({
  className,
  startDelay = 0,
  duration = 1.5,
}: Props) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = startDelay + i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration, bounce: 0 },
          opacity: { delay, duration },
        },
      };
    },
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.svg
        viewBox="0 0 31 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
        className="w-64 h-64"
        style={{ width: "100%", height: "100%" }}
      >
        <motion.path
          d="M3.53848 9.97556C3.16882 9.97556 4.27787 9.95808 4.64655 9.93123C7.64742 9.71272 10.5874 9.1152 13.5111 8.42425C17.031 7.59244 20.4818 6.58599 24.0822 6.18594"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          custom={0}
        />
        <motion.path
          d="M11.716 3.19414C11.716 -2.12628 11.3171 13.83 11.3171 19.1504C11.3171 20.6933 11.7966 19.6268 12.7355 18.818C15.4408 16.4872 18.6421 13.8595 22.3314 13.4549C25.5693 13.0998 28.6228 15.6403 29.2236 18.7515C30.0484 23.0226 27.9517 26.7518 24.8135 29.5663C19.6795 34.1706 12.2039 37.236 5.24489 35.8158C3.93949 35.5494 2.34174 34.6266 2.34174 33.1121"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          custom={1}
        />
      </motion.svg>
    </div>
  );
}
