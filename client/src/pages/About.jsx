"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import NuvaLogo from "../assets/Nuva Logo.mp4";
import aiicon from "../assets/aiicon.gif";
import bilakhia from "../assets/bilakhia-removebg-preview.png";

const timeline = [
  {
    name: "Founded company",
    description:
      "Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.",
    date: "Aug 2021",
    dateTime: "2021-08",
  },
  {
    name: "Secured $65m in funding",
    description:
      "Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.",
    date: "Dec 2021",
    dateTime: "2021-12",
  },
  {
    name: "Released beta",
    description:
      "Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.",
    date: "Feb 2022",
    dateTime: "2022-02",
  },
  {
    name: "Global launch of product",
    description:
      "Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.",
    date: "Dec 2022",
    dateTime: "2022-12",
  },
];
const jobOpenings = [
  {
    id: 1,
    role: "Full-time designer",
    href: "#",
    description:
      "Quos sunt ad dolore ullam qui. Enim et quisquam dicta molestias. Corrupti quo voluptatum eligendi autem labore.",
    salary: "$75,000 USD",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    role: "Laravel developer",
    href: "#",
    description:
      "Et veniam et officia dolorum rerum. Et voluptas consequatur magni sapiente amet voluptates dolorum. Ut porro aut eveniet.",
    salary: "$125,000 USD",
    location: "San Francisco, CA",
  },
  {
    id: 3,
    role: "React Native developer",
    href: "#",
    description:
      "Veniam ipsam nisi quas architecto eos non voluptatem in nemo. Est occaecati nihil omnis delectus illum est.",
    salary: "$105,000 USD",
    location: "San Francisco, CA",
  },
];

const accordionData = [
  {
    id: 1,
    title: "AI-Powered Accuracy",
    content:
      "Detects diseases with AI precision, reducing misdiagnosis and aiding early intervention.",
  },
  {
    id: 2,
    title: "Interactive Image Analysis",
    content:
      "Doctors can visualize, refine, and adjust AI-generated insights easily.",
  },
  {
    id: 3,
    title: "Seamless AI Diagnosis Reporting",
    content:
      "Generate clear, automated reports for better documentation and decision-making.",
  },
  {
    id: 4,
    title: "On-the-Go Diagnostics",
    content: "Portable fundus camera enables high-resolution imaging anywhere.",
  },
  {
    id: 5,
    title: "Trusted & Secure",
    content:
      "Ensures data privacy, compliance, and security for reliable medical use.",
  },
];

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  return (
    <div className="bg-primary relative">
      {/* Header */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-10 size-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>
      <div className="relative inset-0 h-[70vh]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover z-10"
        >
          <source src={NuvaLogo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Header />

      <div className="relative z-10">
        <div className="w-full flex items-center justify-center -mt-32">
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-[70%] mx-auto p-6 text-center rounded-2xl bg-inverse shadow-lg shadow-[#387AA4]"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl font-bold text-gray-800 mb-10 gradient-text"
            >
              Revolutionizing Retinal Disease Detection
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-inverse text-lg"
            >
              "Ophthalmvision is an AI-powered retinal disease detection platform
              designed to assist doctors in diagnosing diabetic retinopathy,
              glaucoma, and AMD with high precision. By leveraging advanced AI,
              Ophthalmvision enables early detection, reducing misdiagnosis and
              improving patient outcomes. Traditional methods can be slow and
              error-prone—Ophthalmvision revolutionizes the process with real-time
              image analysis, allowing doctors to refine AI insights and
              generate automated diagnosis reports. With seamless image
              acquisition, interactive diagnostics, and AI-driven accuracy,
              Ophthalmvision enhances clinical efficiency, ensuring faster and more
              confident diagnoses."
            </motion.p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-6 p-4 bg-[#387AA4] text-white rounded-xl"
            >
              <p className="font-medium text-xl">
                AI-powered insights, seamless diagnostics, and enhanced clinical
                confidence.
              </p>
            </motion.div>
          </motion.section>
        </div>
      </div>

      {/* Mission and vision section */}
      <div className="relative">
        <div className="mx-auto mt-32 max-w-7xl z-10">
          <div className="relative isolate overflow-hidden px-6 py-24 bg-inverse  text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto text-5xl font-bold tracking-tight gradient-text">
              Our Mission
            </h2>
            <p className="mx-auto mt-6 text-lg/8 text-inverse text-justify">
              Ophthalmvision envisions a world where advanced AI-driven retinal
              diagnostics empower healthcare professionals to detect and manage
              vision-threatening diseases with unparalleled accuracy and
              efficiency. By integrating cutting-edge artificial intelligence
              with intuitive image analysis, we aim to bridge the gap between
              early detection and timely intervention for diabetic retinopathy,
              glaucoma, and age-related macular degeneration (AMD). Our vision
              is to revolutionize ophthalmic care by making AI-powered
              diagnostics accessible, precise, and seamless, ultimately reducing
              preventable blindness and improving patient outcomes worldwide.
            </p>
            <div
              aria-hidden="true"
              className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl"
            >
              <div
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
                className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto mb-16 mt-32 max-w-7xl z-10">
          <div className="relative isolate overflow-hidden px-6 py-24 text-center bg-inverse shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto text-5xl font-bold gradient-text">
              Our Vision
            </h2>
            <p className="mx-auto mt-6  text-lg/8 text-gray-800 text-justify text-inverse">
              At Ophthalmvision, our mission is to empower doctors with AI-enhanced
              diagnostic tools that streamline retinal disease detection and
              improve clinical decision-making. We are committed to providing
              high-resolution imaging, advanced AI analysis, and interactive
              visualization features that enhance accuracy, efficiency, and
              confidence in diagnoses. By enabling seamless image acquisition,
              annotation refinement, and AI-driven reporting, we strive to
              enhance patient care, optimize treatment planning, and contribute
              to a future where preventable vision loss is minimized through
              early and accurate detection.
            </p>
            <div
              aria-hidden="true"
              className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl"
            >
              <div
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
                className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us? */}
      <div className="w-full flex flex-col items-center justify-center mt-40">
        <h2 className="t w-[70%] text-7xl font-bold text-left mb-12 text-secondary">
          Why Choose Ophthalmvision?
        </h2>
        <div className="flex w-[70%] items-center justify-center gap-y-20">
          <div className="w-1/2 mx-auto p-4 z-10">
            <div className="space-y-3">
              {accordionData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex justify-between items-center p-4 bg-inverse opacity-90 transition-all hover:cursor-pointer"
                  >
                    <span className="text-xl font-semibold text-inverse">
                      {item.title}
                    </span>
                    {activeIndex === item.id ? (
                      <ChevronUpIcon className="h-6 w-6 text-inverse" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-inverse" />
                    )}
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                      activeIndex === item.id
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 text-secondary">{item.content}</div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <img src={aiicon} alt="gif" className="ml-20" />
          </div>
        </div>
      </div>

      <main className="isolate">
        {/* Family section */}
        <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
          />
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              {/* <h1 class="max-w-2xl text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl lg:col-span-2 xl:col-auto">We’re changing the way people connect</h1> */}
              <h1 className="max-w-2xl text-balance text-5xl mt-16 font-semibold tracking-tight text-gray-900 sm:text-7xl lg:col-span-2 xl:col-auto">
                The Bilakhia Family Journey
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                  Over the past three decades, The Bilakhia Family has worked
                  towards accelerating technologies over various fronts. From
                  spearheading the printing inks and agrochemical sectors to
                  becoming one of the largest medical device companies in Asia.
                </p>
              </div>
              <img
                alt=""
                src={bilakhia}
                className=" w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2"
              />
            </div>
          </div>
          {/* <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" /> */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
