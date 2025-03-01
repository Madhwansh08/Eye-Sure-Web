import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

export const BarLoader = () => {
  const messages = ["Processing...", "Completing..."];
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1500); // change message every 1.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        data-testid="bar-loader"
        transition={{
          staggerChildren: 0.25,
        }}
        initial="initial"
        animate="animate"
        className="flex gap-1"
      >
        <motion.div
          variants={variants}
          className="h-16 w-3 dark:bg-[#5c60c6] bg-[#030811]"
        />
        <motion.div
          variants={variants}
          className="h-16 w-3 dark:bg-[#f2ebe3] bg-[#030811]"
        />
        <motion.div
          variants={variants}
          className="h-16 w-3 dark:bg-[#5c60c6] bg-[#030811]"
        />
        <motion.div
          variants={variants}
          className="h-16 w-3 dark:bg-[#f2ebe3] bg-[#030811]"
        />
        <motion.div
          variants={variants}
          className="h-16 w-3 dark:bg-[#5c60c6] bg-[#030811]"
        />
      </motion.div>
      <motion.div
        className="mt-4 text-xl font-semibold text-secondary"
        key={currentMessage} // key triggers re-animation on change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {messages[currentMessage]}
      </motion.div>
    </div>
  );
};
