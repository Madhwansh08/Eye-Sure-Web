import React, { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimate,
} from "framer-motion";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../utils/config";

export const Contact = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Form validation
      if (!formData.name || !formData.email || !formData.comment) {
        toast.error("All fields are required");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return;
      }

      const response = await axios.post(
        `${config.API_URL}/api/contact/submit`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Feedback submitted successfully");
        setFormData({ name: "", email: "", comment: "" }); // Reset form
        setDrawerOpen(false); // Close drawer
        navigate("/");
      } else {
        toast.error(`Submission failed: ${response.statusText}`);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-secondary px-8 py-24 dark:text-[#030811] text-[#f2ebe3]">
      <BlockInTextCard
        tag="Contact Us"
        text={
          <>
            <strong>Have any query?</strong> We're here to help!
          </>
        }
        examples={[
          "Need help with Technical support",
          "Want to learn more about the services",
          "Feedback/Suggestion",
          "Need assistance with a purchase",
        ]}
        onContactClick={() => setDrawerOpen(true)}
      />
      <DragCloseDrawer open={drawerOpen} setOpen={setDrawerOpen}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-[#030811] ring-1 ring-gray-900/10 lg:w-1/2">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full stroke-[#5c60c6]/10"
                >
                  <defs>
                    <pattern
                      x="100%"
                      y={-1}
                      id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                      width={100}
                      height={200}
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M130 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                  </defs>
                  <rect
                    fill="#030811"
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                  />
                  <svg
                    x="100%"
                    y={-1}
                    className="overflow-visible fill-[#c5865c]"
                  >
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect
                    fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                  />
                </svg>
              </div>
              <h2 className="text-pretty text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                Get in touch
              </h2>
              <p className="mt-6 text-lg/8 text-secondary">
                Proin volutpat consequat porttitor cras nullam gravida at. Orci
                molestie a eu arcu. Sed ut tincidunt integer elementum id sem.
                Arcu sed malesuada et magna.
              </p>
              <dl className="mt-10 space-y-4 text-base/7 text-gray-600">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <EnvelopeIcon
                      aria-hidden="true"
                      className="h-7 w-6 text-gray-400"
                    />
                  </dt>
                  <dd>
                    <a
                      href="mailto:hello@example.com"
                      className="hover:text-secondary"
                    >
                      hello@example.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <form
            action="#"
            method="POST"
            className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48"
          >
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-semibold text-secondary"
                  >
                    First name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-secondary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm/6 font-semibold text-secondary"
                  >
                    Last name
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-secondary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-semibold text-secondary"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-secondary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm/6 font-semibold text-secondary"
                  >
                    Phone number
                  </label>
                  <div className="mt-2.5">
                    <input
                      id="phone-number"
                      name="phone-number"
                      type="tel"
                      autoComplete="tel"
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-secondary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm/6 font-semibold text-secondary"
                  >
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-secondary outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-secondary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#030811] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Send message
                </button>
              </div>
            </div>
          </form>
        </div>
      </DragCloseDrawer>
    </div>
  );
};

const BlockInTextCard = ({ tag, text, examples, onContactClick }) => {
  return (
    <div className="w-full max-w-xl space-y-6">
      <div>
        <p className="mb-1.5 text-2xl font-bold uppercase">{tag}</p>
        <hr className="dark:border-[#030811] border-[#fdfdfd]" />
      </div>
      <p className="max-w-lg text-xl leading-relaxed">{text}</p>
      <div>
        <Typewrite examples={examples} />
        <hr className="border-[#030811]" />
      </div>
      <button
        onClick={onContactClick}
        className="w-full rounded-full border dark:border-[#030811] border-[#fdfdfd] py-2 text-sm font-medium transition-colors hover:bg-[#030811] hover:text-[#f2ebe3]"
      >
        Contact Support
      </button>
    </div>
  );
};

const LETTER_DELAY = 0.025;
const BOX_FADE_DURATION = 0.125;

const FADE_DELAY = 5;
const MAIN_FADE_DURATION = 0.25;

const SWAP_DELAY_IN_MS = 5500;

const Typewrite = ({ examples }) => {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setExampleIndex((pv) => (pv + 1) % examples.length);
    }, SWAP_DELAY_IN_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="mb-2.5 text-sm font-light uppercase">
      <span className="inline-block size-2 dark:bg-[#030811] bg-[#fdfdfd]" />
      <span className="ml-3">
        EXAMPLE:{" "}
        {examples[exampleIndex].split("").map((l, i) => (
          <motion.span
            initial={{
              opacity: 1,
            }}
            animate={{
              opacity: 0,
            }}
            transition={{
              delay: FADE_DELAY,
              duration: MAIN_FADE_DURATION,
              ease: "easeInOut",
            }}
            key={`${exampleIndex}-${i}`}
            className="relative"
          >
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: i * LETTER_DELAY,
                duration: 0,
              }}
            >
              {l}
            </motion.span>
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: i * LETTER_DELAY,
                times: [0, 0.1, 1],
                duration: BOX_FADE_DURATION,
                ease: "easeInOut",
              }}
              className="absolute bottom-[3px] left-[1px] right-0 top-[3px] dark:bg-[#030811] bg-[#fdfdfd]"
            />
          </motion.span>
        ))}
      </span>
    </p>
  );
};

const DragCloseDrawer = ({ open, setOpen, children }) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();
  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, { opacity: [1, 0] });
    const yStart = typeof y.get() === "number" ? y.get() : 0;
    animate("#drawer", { y: [yStart, height] });
    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 dark:bg-[#030811]/70 bg-[#fdfdfd]/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ ease: "easeInOut" }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-[#030811]"
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-[#030811] p-4">
              <button
                onPointerDown={(e) => controls.start(e)}
                className="h-2 w-16 cursor-grab touch-none rounded-full bg-[#f2ebe3] hover:bg-[#c6715c] active:cursor-grabbing"
              />
            </div>
            <div className="relative z-0 h-full overflow-y-scroll p-4 pt-12">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Contact;
