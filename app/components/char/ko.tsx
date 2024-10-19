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
        viewBox="0 0 32 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-64 h-64"
        initial="hidden"
        animate="visible"
        style={{ width: "100%", height: "100%" }}
      >
        <motion.path
          d="M2.38831 9.97283C2.38831 8.13006 4.92295 5.655 6.4217 4.74272C10.8239 2.06309 16.8151 1.34828 21.835 1.90605C24.1597 2.16435 26.4063 2.95102 28.561 3.8341C29.8914 4.37933 30.3129 4.18648 29.6137 5.58486C28.8379 7.13652 26.8845 8.25084 26.1233 9.77338"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          custom={0}
        />
        <motion.path
          d="M6.77628 29.5193C6.77628 31.0037 8.06107 32.3729 9.25836 33.1537C11.7226 34.7609 13.8562 35.5043 16.7933 35.9018C18.7533 36.167 20.6842 36.3885 22.6661 36.2563C24.787 36.1149 26.6238 35.3659 28.6275 34.7494C28.9659 34.6452 31.4172 34.1608 30.1123 33.5083"
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
