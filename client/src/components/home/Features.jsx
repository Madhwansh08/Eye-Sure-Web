import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";


import feature1 from "../../assets/feature1.png";
import feature2 from "../../assets/feature2.png";
import feature3 from "../../assets/feature3.png";

const IMG_PADDING = 20;
const IMG_HEIGHT = "50vh"; // Smaller image height

const FeatureData = [
  {
    id: 1,
    imgUrl: feature1,
    subheading: "Abnormality Detection",
    heading: "Seamless Image Acquisition",
    description:
      "Capture high-resolution retinal images using a handheld fundus camera for on-the-go diagnostics.",
  },
  {
    id: 2,
    imgUrl: feature2,
    subheading: "Editing Interface",
    heading: "AI-Powered Multi-Disease Detection",
    description:
      "Detect diabetic retinopathy, glaucoma, and AMD with advanced AI analysis for early and accurate diagnosis.",
  },
  {
    id: 3,
    imgUrl: feature3,
    subheading: "Modern Dashboard",
    heading: "Interactive Image Analysis & Reports Generation",
    description:
      "Doctors can visualize, add annotations, report generation and refine AI-generated insights for enhanced accuracy.",
  },
];

export const Features = () => {
  return (
    <div className="bg-primary">
      {FeatureData.map((feature) => (
        <TextParallaxContent
          key={feature.id}
          imgUrl={feature.imgUrl}
          subheading={feature.subheading}
          heading={feature.heading}
        >
          <ExampleContent description={feature.description} />
        </TextParallaxContent>
      ))}
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
      <div className="relative" style={{ height: "100vh" }}>
        <StickyImage imgUrl={imgUrl} imgHeight={IMG_HEIGHT} />
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
        height: imgHeight,
        top: IMG_PADDING,
        scale,
      }}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-[#387AA4]/40"
        style={{ opacity }}
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
        height: imgHeight,
      }}
      className="absolute left-0 top-0 w-full flex-col items-center justify-center text-white flex"
    >
      <p className="text-center uppercase text-secondary text-4xl font-bold md:text-7xl">
        {heading}
      </p>
    </motion.div>
  );
};

const ExampleContent = ({ description }) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl text-secondary font-bold md:col-span-4">
      Feature Description
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-secondary md:text-2xl">{description}</p>
    </div>
  </div>
);
