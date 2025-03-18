import { motion } from "framer-motion";

const cards = [
  {
    id: 1,
    name: "Dr. Rohan Malhotra, MBBS, General Physician",
    description: "Eyesure has been a game-changer in my practice. As a general physician, early detection is key, and this AI-powered tool helps me identify retinal diseases with confidence before referring patients to specialists.",
  },
  {
    id: 2,
    name: "Dr. Ananya Mehta, Ophthalmologist",
    description: "The AI analysis is incredibly precise, but what I appreciate most is the interactive image reannotation. It allows me to verify and refine the diagnosis, ensuring I provide the best care possible.",
  },
  {
    id: 3,
    name: "Dr. Sneha Patel, Optometrist",
    description: "Diabetic retinopathy and glaucoma can be silent threats, and early detection is crucial. Eyesure’s AI-driven insights and detailed reports have significantly improved my efficiency in diagnosing and managing these conditions.",
  },
  {
    id: 4,
    name: "Dr. Manish Verma, MBBS, Internal Medicine",
    description: "I often see patients with systemic diseases that impact eye health. Eyesure helps me quickly assess retinal images and detect potential issues early, making referrals more precise and timely.",
  },
];

export default function Testimonial({key,card}) {
  // Reusable testimonial set (two testimonials side by side) with gap between them
  const testimonialSet = (
    <div className="flex justify-between gap-8 w-full">
      {/* First Testimonial */}
      <div className="flex-1 pr-4">
        <figure className="mt-10 flex flex-col justify-between">
          <blockquote className="text-xl/8 font-semibold text-pretty text-secondary">
            <p>
              “Amet amet eget scelerisque tellus sit neque faucibus non
              eleifend. Integer eu praesent at a. Ornare arcu gravida natoque
              erat et cursus tortor consequat at. Vulputate gravida sociis enim
              nullam ultricies habitant malesuada lorem ac. Tincidunt urna dui
              pellentesque sagittis.”
            </p>
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-x-6">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-14 h-14 rounded-full bg-gray-50"
            />
            <div className="text-base">
              <div className="font-semibold text-secondary">Judith Black</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );

  return (
    <section className="bg-primary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-secondary text-center text-[#03081] uppercase sm:text-4xl mb-10 lg:text-6xl">
          What our doctors say
        </h1>
        {/* Overflow-hidden container to mask the moving content */}
        <div className="overflow-hidden ">
          {/* Motion container with duplicated testimonial sets and gap */}
          <motion.div
            className="flex gap-20"
            animate={{ x: [0, "calc(-100% - 2rem)"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {/* Each testimonial set is wrapped in a bordered container */}
            {/* <div className="w-full flex-shrink-0 border-[#030811]/80 p-4">
              {testimonialSet}
            </div>
            <div className="w-full flex-shrink-0  border-[#030811]/80 p-4">
              {testimonialSet}
            </div>
            <div className="w-full flex-shrink-0  border-[#030811]/80 p-4">
              {testimonialSet}
            </div> */}
            {cards.map((card) => (
              <Testimonial key={card.id} card={card} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
