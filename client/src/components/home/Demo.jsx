
export default function Demo() {
  return (
    <div className="bg-primary ">
      <div className="flex flex-col border-b border-gray-200 lg:border-0">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute hidden h-full w-1/2 bg-gradient-to-b dark:from-[#030811] rounded-t-lg  dark:to-[#0b071a]  from-[#fdfdfd] to-[#fdfefd]  lg:block"
          />
          <div className="relative bg-primary lg:bg-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
              <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
                <div className="lg:pr-16 lg:mr-12">
                  <h1 className="text-4xl font-bold tracking-tight text-secondary sm:text-5xl xl:text-6xl">
                    Revolutionizing Healthcare with EyeSure
                  </h1>
                  <p className="mt-4 text-xl pt-4 text-gray-400">
                    Explore how AI-powered solutions are transforming medical
                    imaging by accurately detecting abnormalities. Watch our
                    demo to see the future of diagnostics in action.
                  </p>
                  <div className="mt-8">
                    <a href="https://merai-chennai.s3.ap-south-1.amazonaws.com/static/Opthalmvision.mp4" target="_blank" rel="noopener noreferrer">
                      <button className="inline-block rounded-md border border-transparent bg-secondary px-8 py-3 font-medium text-secondary hover:bg-[#030811] hover:text-[#fdfdfd]">
                        Watch Full Demo
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-48 w-full rounded-t-lg sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#7162d7]/20 to-transparent pointer-events-none"></div>

            {/* Video */}
            <video
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.target.play()}
              onFocus={(e) => e.target.play()}
              onMouseOut={(e) => e.target.pause()}
              onBlur={(e) => e.target.pause()}
            >
              <source
                src="https://merai-chennai.s3.ap-south-1.amazonaws.com/static/Opthalmvision.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
