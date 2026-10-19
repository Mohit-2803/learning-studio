"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    src: "/illustrations/learning.svg",
    alt: "A learner reading and taking notes beside a laptop",
    scale: "max-h-[78%] max-w-[78%] scale-[1.32] max-sm:scale-[1.1]",
  },
  {
    src: "/illustrations/thesis.svg",
    alt: "A student studying with a laptop and a stack of books",
    scale: "max-h-[75%] max-w-[75%] scale-[1.37] max-sm:scale-[1.1]",
  },
  {
    src: "/illustrations/typing.svg",
    alt: "Hands practicing on a laptop keyboard",
    scale: "max-h-[70%] max-w-[70%] scale-[1.46] max-sm:scale-[1.1]",
  },
];

export default function HeroIllustrationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      if (!reducedMotion.matches && document.visibilityState === "visible") {
        timer = setInterval(() => {
          setActiveIndex((index) => (index + 1) % slides.length);
        }, 6000);
      }
    };

    start();
    document.addEventListener("visibilitychange", start);
    reducedMotion.addEventListener("change", start);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", start);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <div
      className="flex h-[300px] min-w-0 flex-col items-center justify-center sm:h-[340px] min-[851px]:h-[480px]"
      role="region"
      aria-label="Learning illustrations"
      aria-roledescription="carousel"
    >
      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        <img
          key={activeSlide.src}
          className={`pointer-events-none max-h-full max-w-full object-contain ${activeSlide.scale}`}
          src={activeSlide.src}
          width={500}
          height={500}
          alt={activeSlide.alt}
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${slides.length}`}
        />
      </div>
      <div className="relative z-10 mt-5 flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-bg-primary/90 px-2 shadow-sm backdrop-blur" aria-hidden="true">
        {slides.map((slide, index) => (
          <span
            key={slide.src}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${index === activeIndex ? "w-5 bg-[#7160CE]" : "w-1.5 bg-[#cbc8d5]"}`}
          />
        ))}
      </div>
      <span className="sr-only" aria-live="off" aria-atomic="true">
        Illustration {activeIndex + 1} of {slides.length}: {activeSlide.alt}
      </span>
    </div>
  );
}
