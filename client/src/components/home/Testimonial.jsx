import { motion } from "framer-motion";
import user from "../../assets/download.jpeg"

const testimonials = [
  {
    quote:
      "Ophthalmvision has been a game-changer in my practice. As a general physician, early detection is key, and this AI-powered tool helps me identify retinal diseases with confidence before referring patients to specialists.",
    name: "Dr. Rohan Malhotra",
    designation: "MBBS, General Physician",
    image: user,
  },
  {
    quote:
      "The AI analysis is incredibly precise, but what I appreciate most is the interactive image reannotation. It allows me to verify and refine the diagnosis, ensuring I provide the best care possible.",
    name: "Dr. Ananya Mehta",
    designation: "Ophthalmologist",
    image: user,
  },
  {
    quote:
      "Diabetic retinopathy and glaucoma can be silent threats, and early detection is crucial. Opthalmvision’s AI-driven insights and detailed reports have significantly improved my efficiency in diagnosing and managing these conditions.",
    name: "Dr. Sneha Patel",
    designation: "Optometrist",
    image: user,
  },
  {
    quote:
      "I often see patients with systemic diseases that impact eye health. Ophthalmvision helps me quickly assess retinal images and detect potential issues early, making referrals more precise and timely.",
    name: "Dr. Manish Verma",
    designation: "MBBS, Internal Medicine",
    image: user,
  },
];

export default function Testimonial() {
  return (
    <section className="bg-primary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-secondary text-center text-[#03081] uppercase sm:text-4xl mb-10 lg:text-6xl">
          What our doctors say
        </h1>
        {/* Overflow-hidden container to mask the moving content */}
        <div className="overflow-hidden">
          {/* Motion container with duplicated testimonial sets and gap */}
          <motion.div
            className="flex gap-10 w-[400%]" // Ensure width to fit all items
            animate={{ x: [0, "-100%"] }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
          >
            {/* Duplicate testimonials to create seamless scrolling */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="w-[25%] flex-shrink-0 p-4">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="flex justify-between gap-8 w-full min-h-[220px] bg-primary p-4 rounded-lg shadow-lg border border-white">
      <div className="flex-1 pr-4">
        <figure className="mt-6 flex flex-col justify-between">
          <blockquote className="text-xl font-semibold text-pretty text-secondary">
            <p>{`"${testimonial.quote}"`}</p>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-x-6">
            <img
              alt={testimonial.name}
              src={testimonial.image}
              className="w-14 h-14 rounded-full bg-gray-50"
            />
            <div className="text-base">
              <div className="font-semibold text-secondary">{testimonial.name}</div>
              <div className="text-sm text-gray-400">{testimonial.designation}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};
