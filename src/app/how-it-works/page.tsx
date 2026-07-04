import type { Metadata } from "next";
import RoadJourney from "./RoadJourney";

export const metadata: Metadata = {
  title: "How It Works | Project Resource Map",
  description:
    "See how Project Resource Map helps you explore categories, filter by location and cancer type, and connect with trusted support organizations.",
};

export default function HowItWorksPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div
        aria-hidden
        className="hero-gradient animate-gradient-drift pointer-events-none fixed inset-0 -z-10"
      />

      <section className="mx-auto w-full max-w-3xl px-6 pb-6 pt-20 text-center sm:pt-28">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          How It Works
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">
          Three simple steps to find the support you need. Follow the road
          as you scroll.
        </p>
      </section>

      <div className="py-12 sm:py-20">
        <RoadJourney />
      </div>
    </div>
  );
}
