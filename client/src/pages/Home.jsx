import React, { useEffect, useRef, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useInView } from "react-intersection-observer";
import Content from "../components/home/Content";
import Hero from "../components/home/Hero";
import Header from "../components/common/Header";
import CountUp from "react-countup";
import { Features } from "../components/home/Features";
import Research from "../components/home/Research";
import Testimonial from "../components/home/Testimonial";
import Demo from "../components/home/Demo";
import Contact from "../components/home/Contact";
import { useSelector } from "react-redux";
import Footer from "../components/common/Footer";

const Home = () => {
  const featuresRef = useRef(null);
  const demoRef = useRef(null);

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-in-out", once: true });
  }, []);

  // Setup intersection observer for triggering count-up animations
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  // Custom throttle function to limit how often a function is executed
  const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return func(...args);
    };
  };

  // Throttled scroll event listener for smooth scroll handling
  useEffect(() => {
    const handleScroll = throttle(() => {
      // Replace this with any smooth scroll logic you might need
      console.log("Throttled scroll event triggered");
    }, 100); // Adjust delay (in ms) as needed

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Throttled scroll handlers
  const scrollToFeatures = useCallback(
    throttle(() => {
      featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000),
    []
  );

  const scrollToDemo = useCallback(
    throttle(() => {
      demoRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000),
    []
  );

  const auth = useSelector((state) => state.auth);
  console.log(auth);

  return (
    <div className="bg-primary flex flex-col min-h-screen">
      <Header />
      <Hero scrollToFeatures={scrollToFeatures} scrollToDemo={scrollToDemo} />
      <section
        ref={ref}
        className="py-5 mt-5 bg-primary sm:py-16 lg:py-24"
        data-aos="fade-up"
      >
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl uppercase font-bold whitespace-nowrap leading-tight text-secondary sm:text-4xl lg:text-6xl">
              Our results in numbers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-10 text-center  lg:mt-24 sm:gap-x-8 md:grid-cols-2">
            {/* Accuracy */}
            <div>
              <h3 className="font-bold text-7xl gradient-text">
                {inView && (
                  <CountUp start={0} end={94} duration={2.5} suffix="%" />
                )}
              </h3>
              <p className="mt-4 text-3xl font-medium text-secondary">
                Accuracy
              </p>
            </div>

            {/* Doctors */}
            {/* <div>
      <h3 className="font-bold text-7xl gradient-text">
        {inView && <CountUp start={0} end={4821} duration={3} />}
      </h3>
      <p className="mt-4 text-3xl font-medium dark:text-[#030811] text-[#fdfdfd]">
        Doctors
      </p>
    </div> */}

            {/* Data Set */}
            <div>
              <h3 className="font-bold text-7xl gradient-text">
                {inView && (
                  <CountUp
                    start={0}
                    end={75}
                    duration={1.5}
                    separator=","
                    suffix="k"
                  />
                )}
              </h3>
              <p className="mt-4 text-3xl font-medium darktext-[#030811] text-[#fdfdfd]">
                No. Of Images
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <section>
        <Content />
      </section> */}
      <section ref={featuresRef}>
        <div className="flex flex-col items-center justify-center py-5 mt-5 bg-primary sm:py-16 lg:py-24">
          <h2 className="text-3xl uppercase font-bold text-center text-secondary sm:text-4xl lg:text-6xl">
            Our Features
          </h2>
        </div>
        <Features />
      </section>
      <section>
        <Research />
      </section>
      <section>
        <Testimonial />
      </section>
      <section ref={demoRef}>
        <Demo />
      </section>
      <section>
        <Contact />
      </section>
      <Footer scrollToFeatures={scrollToFeatures}/>
    </div>
  );
};

export default Home;
