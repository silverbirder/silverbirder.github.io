"use client";

import { motion } from "framer-motion";

type Props = {
  className?: string;
  startDelay?: number;
  duration?: number;
  strokeColor?: string;
};

export default function Spiral({
  className,
  startDelay = 0,
  duration = 1.5,
  strokeColor = "stroke-current",
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
        viewBox="0 0 87 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
        style={{ width: "100%", height: "100%" }}
      >
        <motion.path
          d="M1.97026 36.9618C1.19643 36.7683 1.96666 31.3258 2.09215 30.679C2.72864 27.3987 4.56686 24.2314 5.75988 21.1164C6.95065 18.0071 8.98806 15.6845 11.3446 13.4152C14.0269 10.8323 16.6736 8.35552 19.91 6.46761C23.5992 4.31557 29.4809 2.07392 33.5282 4.45092C37.4842 6.7743 39.4171 11.6927 39.4675 16.13C39.5277 21.427 36.2336 26.2284 32.398 29.6707C29.8802 31.9303 25.6408 36.2336 22.2148 33.0614C18.0729 29.2263 22.5615 23.4355 24.7523 19.964C27.0244 16.3634 29.8257 13.0751 32.7969 10.0356C34.9748 7.80761 37.2876 6.09817 40.221 4.93847C46.294 2.53753 54.1661 4.76478 57.9169 10.1464C59.0882 11.8269 60.0846 14.7706 60.1996 16.8392C60.3222 19.0469 60.5526 21.6854 59.9004 23.8201C59.301 25.7818 58.5796 27.5892 57.1302 29.0723C55.4315 30.8105 54.124 32.7833 52.2325 34.3246C49.8724 36.2477 46.5335 36.7844 44.8084 33.7262C42.1398 28.9956 44.9682 23.5947 46.9802 19.2659C48.685 15.5981 50.5464 11.6295 53.6508 8.92754C56.4805 6.46464 59.9402 3.698 63.7011 2.87745C70.1389 1.47284 77.2674 3.36637 82.6159 7.11029C83.9748 8.06154 84.7941 8.79153 85.3418 10.4345"
          strokeWidth="2"
          strokeLinecap="round"
          className={strokeColor}
          variants={pathVariants}
          custom={0}
        />
      </motion.svg>
    </div>
  );
}
