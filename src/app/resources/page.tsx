import type { Metadata } from "next";
import ResourceDirectory from "./ResourceDirectory";

export const metadata: Metadata = {
  title: "Resource Directory",
  description:
    "Search and filter trusted cancer support resources by category, location, cancer type, and cost.",
};

export default function ResourcesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div
        aria-hidden
        className="hero-gradient animate-gradient-drift gradient-fade-bottom pointer-events-none fixed inset-x-0 top-0 -z-10 h-[32rem] sm:h-[36rem]"
      />

      <section className="relative w-full px-6 pb-20 pt-20 text-center sm:pb-28 sm:pt-24">
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Resource Directory
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">
            Search and filter trusted cancer support resources by category,
            location, cancer type, and cost.
          </p>
        </div>
      </section>

      <ResourceDirectory />
    </div>
  );
}
