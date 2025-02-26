import React, { useEffect } from "react";
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
import Footer from "../components/common/Footer";

const Home = () => {
    useEffect(() => {
        AOS.init({ duration: 600, easing: "ease-in-out", once: true }); // Duration of animation and trigger once
      }, []);
    
      // Setting up intersection observer to trigger count-up when section is in view
      const { ref, inView } = useInView({
        triggerOnce: true, // trigger only once on first scroll into view
        threshold: 0.5, // Trigger when 50% of the element is visible
      });


  return (
    <div className="bg-primary flex flex-col min-h-screen">
      <Header />
      <Hero />
      <section
        ref={ref}
        className="py-5 mt-5 bg-primary sm:py-16 lg:py-24"
        data-aos="fade-up"
      >
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold whitespace-nowrap leading-tight  text-secondary sm:text-4xl lg:text-6xl">
              Our results in numbers
            </h2>
     
          </div>

          <div className="grid grid-cols-1 gap-8 mt-10 text-center lg:mt-24 sm:gap-x-8 md:grid-cols-3">
            <div>
              <h3 className="font-bold text-7xl text-transparent  bg-clip-text bg-gradient-to-r text-primary">
                {inView && (
                  <CountUp start={0} end={97} duration={2.5} suffix="%" />
                )}
              </h3>
              <p className="mt-4 text-xl font-medium dark:text-[#F2EBE3] text-[#030811]">
                Accuracy
              </p>
            </div>
            <div>
              <h3 className="font-bold text-7xl text-transparent bg-clip-text bg-gradient-to-r text-primary">
                {inView && <CountUp start={0} end={4821} duration={3} />}
              </h3>
              <p className="mt-4 text-xl font-medium dark:text-[#F2EBE3] text-[#030811]">
                Doctors
              </p>
            </div>
            <div>
              <h3 className="font-bold text-7xl text-transparent bg-clip-text bg-gradient-to-r text-primary">
                {inView && (
                  <CountUp
                    start={0}
                    end={37000}
                    duration={1.5}
                    separator=","
                    suffix="+"
                  />
                )}
              </h3>
              <p className="mt-4 text-xl font-medium dark:text-[#F2EBE3] text-[#030811]">
                Data Set
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <section>
        <Content />
      </section> */}
      <section>
        <div className="flex flex-col items-center justify-center py-5 mt-5 bg-primary sm:py-16 lg:py-24">
          
          <h2 className="text-3xl font-bold text-center text-secondary sm:text-4xl lg:text-6xl">
            Our Features
          </h2>
        </div>
        <Features/>
      </section>
      <section>
        <Research/>
      </section>
      <section>
        <Testimonial/>
      </section>
      <section>
        <Demo/>
      </section>
      <section>
        <Contact/>
      </section>
     <Footer/>
    </div>

  );
};

export default Home;
