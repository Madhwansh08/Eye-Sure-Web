import { motion} from "framer-motion";
import { useState, useEffect } from "react";




const steps = [
  {
    name: "Upload Both Fundus Images",
    description: "Please upload valid fundus images in supported formats (.png).",
    status: "complete",
  },
  {
    name: "Data Processing",
    description: "Kindly wait while the system processes the fundus images.",
    status: "upcoming",
  },
  {
    name: "Review Analysis",
    description: "Review and edit the Fundus images analysis for accuracy if needed.",
    status: "upcoming",
  },
  {
    name: "Download Report",
    description: "Download the finalized report with detailed findings and observations.",
    status: "upcoming",
  },
];

export default function InstructionSlider() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div >
        <h1 className="text-3xl font-semibold text-primary ">Instructions For the User:</h1>
      </div>
      <motion.nav
        aria-label="Progress"
        className="bg-primary p-4 rounded-lg "
      >
        <ol className="space-y-6">
          {steps.map((step, index) => (
            <motion.li
              key={step.name}
              className={`relative flex items-center ${
                index <= currentStep ? "text-primary" : "text-gray-500"
              }`}
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: currentStep === index ? 1 : 0.5,
                x: currentStep === index ? 0 : 50,
              }}
              transition={{ duration: 0.5 }}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full px-4 border-2 ${
                  currentStep === index ? "text-primary" : "dark:border-gray-300 border-[#030811]"
                }`}
              >
                <span
                  className={`text-xl font-bold ${
                    currentStep === index ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </span>
              </span>
              <span className="ml-4">
                <span
                  className={`text-xl font-medium ${
                    currentStep === index ? "text-primary" : "text-gray-200"
                  }`}
                >
                  {step.name}
                </span>
                <p className="text-sm">{step.description}</p>
              </span>
            </motion.li>
          ))}
        </ol>
      </motion.nav>

      {/* <div className="mt-6 text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={steps[currentStep].name}
            className="text-xl font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {steps[currentStep].name}
          </motion.h2>
          <motion.p
            key={steps[currentStep].description}
            className="text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {steps[currentStep].description}
          </motion.p>
        </AnimatePresence>
      </div> */}
    </div>
  );
}
