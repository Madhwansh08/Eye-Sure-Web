import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import featimg from "../../assets/featureimg.jpg";
import dashimg from "../../assets/dashboard.jpg";

const IMG_PADDING = 20;
const IMG_HEIGHT = "50vh"; // Smaller image height

export const Features = () => {
  return (
    <div className="bg-primar">
      <TextParallaxContent
        imgUrl={featimg}
        subheading="Abnormality Detection"
        heading="Seamless Abnormality Detection"
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl={dashimg}
        subheading="Editing Interface"
        heading="Intuitive Editing Interface"
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl={dashimg}
        subheading="Modern Dashboard"
        heading="Modern UI Dashboard"
      >
        <ExampleContent />
      </TextParallaxContent>
    </div>
  );
};

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      {/* Keep the container tall for the scroll effect */}
      <div className="relative" style={{ height: "100vh" }}>
        <StickyImage imgUrl={imgUrl} imgHeight={IMG_HEIGHT} />
        {/* Pass the image height to the overlay */}
        <OverlayCopy
          heading={heading}
          subheading={subheading}
          imgHeight={IMG_HEIGHT}
        />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl, imgHeight }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: imgHeight, // Use the smaller height
        top: IMG_PADDING,
        scale,
      }}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-[#c5865c]/80"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading, imgHeight }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={{
        y,
        opacity,
        height: imgHeight, // Restrict the overlay to the image's height
      }}
      // Removed h-screen so the overlay only covers the image area
      className="absolute left-0 top-0 w-full flex-col items-center justify-center text-white flex"
    >
      {/* <p className="mb-2 text-center uppercase text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p> */}
      <p className="text-center uppercase text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ExampleContent = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl text-secondary font-bold md:col-span-4">
      Feature 1
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-secondary md:text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
        blanditiis soluta eius quam modi aliquam quaerat odit deleniti minima
        maiores voluptate est ut saepe accusantium maxime doloremque nulla
        consectetur possimus.
      </p>
      <p className="mb-8 text-xl text-secondary md:text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
        reiciendis blanditiis aliquam aut fugit sint.
      </p>
    </div>
  </div>
);
