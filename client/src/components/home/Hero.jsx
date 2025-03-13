"use client";

import { ChevronRightIcon } from "@heroicons/react/20/solid";
import AtomScene from "./AbstractEye";

export default function Hero() {
  return (
    <div className="bg-gradient-to-b from-primary via-secondary py-15">
      <div className="relative isolate pt-14">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-30">
          {/* Left column with the 3D Atom */}
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:grow h-[600px]">
            {/* The Canvas is transparent, so the gradient behind it will show */}
            <AtomScene />
          </div>

          {/* Right column with text */}
          <div className="mx-auto max-w-xl z-50 lg:mx-0 lg:flex-auto">
            <h1 className="mt-10 text-pretty text-5xl font-semibold tracking-tight text-secondary sm:text-7xl">
              Early detection, Better Vision with{" "}
              <span className="gradient-text">Eyesure</span>
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-secondary sm:text-xl leading-8">
            AI-driven tools to help healthcare professionals analyze, annotate, and report medical images with precision.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button className="rounded-md px-3.5 z-50 py-2.5 text-sm font-semibold bg-secondary text-secondary hover:bg-primary">
                Explore
              </button>
              <button className="flex items-center z-50 text-sm leading-6 font-semibold text-[#fdfdfd] hover:text-primary">
                Watch Demo
                <ChevronRightIcon
                  className="ml-1 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
