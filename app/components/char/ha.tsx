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
        viewBox="0 0 41 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-64 h-64"
        initial="hidden"
        animate="visible"
        style={{ width: "100%", height: "100%" }}
      >
        <motion.path
          d="M4.96204 3.71043C4.96204 6.03717 3.45666 8.27828 2.86778 10.5029C1.53392 15.542 1.71043 21.0341 2.01457 26.2043C2.15864 28.6536 2.75351 31.3546 3.75424 33.6063C4.08634 34.3535 4.26608 35.3259 4.86232 35.9221C5.45187 36.5117 5.54542 36.7925 6.04796 35.9775C6.73585 34.862 7.81864 33.7636 8.75166 32.8306"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          custom={0}
        />
        <motion.path
          d="M16.5303 11.0902C17.6423 10.9666 18.5474 9.81342 19.7216 9.68295C22.0781 9.42111 24.2381 8.17647 26.6581 8.0984C28.3308 8.04445 30.2292 7.97178 31.8661 7.59977C32.4962 7.45656 33.5239 7.32726 34.0822 7.6995"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          custom={1}
        />
        <motion.path
          d="M24.7079 2.31425C24.7079 6.0565 24.3507 9.99549 24.996 13.6831C25.6312 17.3126 26.1363 20.9281 26.8022 24.5533C27.287 27.1927 28.6441 30.3917 27.3452 32.9414C26.8231 33.9661 26.2207 35.3069 25.406 36.1216C24.8389 36.6887 23.6924 36.4208 22.9572 36.4208C21.2171 36.4208 18.3254 35.7679 18.3254 33.5176C18.3254 32.1601 18.2867 30.7969 18.3254 29.4399C18.3604 28.2156 20.3775 28.0931 21.2397 28.0548C26.214 27.8337 31.2687 27.7175 35.9216 29.6394C36.8501 30.0229 37.5781 30.6781 38.4702 31.1242C38.93 31.3541 39.4675 31.9139 39.4675 31.4344"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          variants={pathVariants}
          custom={2}
        />
      </motion.svg>
    </div>
  );
}
