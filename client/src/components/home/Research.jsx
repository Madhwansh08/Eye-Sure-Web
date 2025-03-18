import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const Research = () => {
  return (
    <div className="bg-secondary">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold text-8xl uppercase text-secondary">
          Coming Up Next
        </span>
      </div>
      <HorizontalScrollCarousel />
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-primary">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => (
            <Card card={card} key={card.id} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[800px] w-[700px] overflow-hidden bg-secondary flex flex-col rounded-lg "
    >
      {/* Image section */}
      <div className="relative h-3/4 w-full overflow-hidden">
        <img
          src={card.url}
          alt={card.title}
          className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      {/* Descriptive text section */}
      <div className="relative h-1/4 w-full bg-primary p-4">
        <h3 className="text-4xl font-bold text-secondary">{card.title}</h3>
        <p className="mt-8 text-xl text-secondary">
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default Research;

const cards = [
  {
    url: "/imgs/abstract/1.jpg",
    title: "Cardiovascular Diseases",
    description:"AI-powered detection of atherosclerosis, hypertension, and other heart-related conditions to prevent complications early.",
    id: 1,
  },
  {
    url: "/imgs/abstract/2.jpg",
    title: "Nephrology (kidney diseases)",
    description:"Identifying acute kidney disease (AKD), chronic kidney disease (CKD), and kidney failure at an early stage to enhance treatment strategies.",
    id: 2,
  },
  {
    url: "/imgs/abstract/3.jpg",
    title: "Hepatic (Liver Diseases)",
    description:"Assisting in the early detection of non-alcoholic fatty liver disease (NAFLD) and alcoholic liver disease, crucial for timely management and care.",
    id: 3,
  },
];
