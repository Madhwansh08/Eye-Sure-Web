import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import featimg from "../../assets/featureimg.jpg";
import dashimg from "../../assets/dashboard.jpg";

const IMG_PADDING = 20;
const IMG_HEIGHT = "50vh"; // Smaller image height

const FeatureData = [
  {
    id: 1,
    imgUrl: featimg,
    subheading: "Abnormality Detection",
    heading: "Seamless Abnormality Detection",
    description:
      "AI-driven abnormalities detection in medical imaging represents a significant advancement in diagnostic accuracy and efficiency. This feature utilizes advanced algorithms and machine learning models to identify irregularities in medical images such as X-rays, MRIs, and CT scans.",
  },
  {
    id: 2,
    imgUrl: dashimg,
    subheading: "Editing Interface",
    heading: "Intuitive Editing Interface",
    description:
      "The intuitive editing interface allows users to easily manipulate and modify medical images. This feature provides a user-friendly platform for healthcare professionals to annotate, highlight, and adjust images to enhance diagnostic capabilities and improve patient care.",
  },
  {
    id: 3,
    imgUrl: dashimg,
    subheading: "Modern Dashboard",
    heading: "Modern UI Dashboard",
    description:
      "The modern UI dashboard offers a comprehensive overview of patient data, medical images, and diagnostic reports. This feature provides healthcare professionals with a centralized platform to access and manage patient information, streamline workflows, and improve collaboration among medical teams.",
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
