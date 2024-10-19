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
        viewBox="0 0 27 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
        className="w-64 h-64"
        style={{ width: "100%", height: "100%" }}
      >
        <motion.path
          d="M3.02757 4.90168C4.01956 4.81901 4.99519 4.40079 5.91964 4.07062C8.87423 3.01541 11.8196 2.34184 14.9394 2.02069C15.2777 1.98586 17.2508 1.83527 17.2442 1.8434C15.7992 3.60946 14.1066 5.20296 12.5459 6.86297C9.56051 10.0384 6.44109 13.2083 3.7035 16.6029C3.30385 17.0985 2.0303 18.2348 2.0303 18.941C2.0303 18.9641 2.37373 18.5421 2.39597 18.5199C3.10644 17.8094 3.94193 17.2089 4.77833 16.6583C7.42353 14.9172 10.5913 13.0856 13.7648 12.6139C16.8303 12.1582 20.7897 12.1314 22.9286 14.7192C24.4722 16.5868 24.9835 18.8723 24.9674 21.2569C24.9501 23.8193 23.5951 26.1922 22.4854 28.4372C21.5196 30.3908 20.623 32.4139 18.8952 33.8224C17.2303 35.1797 15.1556 36.5877 13.1554 37.3683C10.2802 38.4903 6.38247 38.9161 3.62593 37.4126"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          custom={0}
        />
      </motion.svg>
    </div>
  );
}
