"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinIcon } from "@/components/MapPinIcon";

const HIGHLIGHTS = [
  {
    icon: HeartIcon,
    title: "100% Free Resources",
    subtitle:
      "No paywalls, hidden fees, or ads. Every single resource listed is completely free to access.",
  },
  {
    icon: VerifiedSearchIcon,
    title: "Vetted & Verified",
    subtitle:
      "Our student team manually checks and updates every program to ensure information is trustworthy.",
  },
  {
    icon: FoldedMapIcon,
    title: "All-in-One Guide",
    subtitle:
      "From transportation and wigs to meals and housing, find everything you need in one single directory.",
  },
];

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div
        aria-hidden
        className="hero-gradient animate-gradient-drift pointer-events-none fixed inset-0 -z-10"
      />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="relative flex w-full max-w-3xl flex-col items-center gap-8"
          >
            <motion.h1
              variants={fadeUp}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
                style={{
                  color:
                    "color-mix(in srgb, var(--color-eucalyptus) 80%, var(--color-eucalyptus-dark) 20%)",
                }}
              >
                Find The Support You Need
              </span>
              <span className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                All In One Place
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg leading-relaxed text-foreground/70"
            >
              Finding help shouldn’t be overwhelming. Search trusted cancer
              support resources by category, location, and eligibility. In
              one searchable directory.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-4 pt-2 sm:flex-row"
            >
              <Link
                href="/resources"
                className="animate-breathe rounded-full bg-eucalyptus px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-eucalyptus-dark hover:shadow-md"
              >
                Find resources
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-foreground/25 px-8 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-foreground/50 hover:bg-foreground/5 hover:shadow-md"
              >
                How it Works
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full bg-eucalyptus-light px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16 lg:gap-20">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/50 shadow-sm">
                  <MapPinIcon className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  About Project Resource Map
                </h2>
              </div>

              <p className="text-lg leading-relaxed text-foreground/80">
                Project Resource Map is a student-run independent directory
                to help patients, caregivers, and families discover cancer
                support resources all in one place. Our goal is to make
                finding help simpler by bringing together everything from
                transportation and financial assistance to nutrition, wigs,
                housing, and emotional support into a single searchable
                directory. We hope this guide makes it a little easier to
                find the support you need.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-3 md:mt-20">
              {HIGHLIGHTS.map(({ icon: Icon, title, subtitle }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/40 bg-white/70 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl sm:text-left"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-eucalyptus/10 text-eucalyptus">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    {subtitle}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-base text-foreground/70">
              Contact us at{" "}
              <a
                href="mailto:projectresourcemap@gmail.com"
                className="font-semibold text-eucalyptus-dark underline-offset-2 hover:underline"
              >
                projectresourcemap@gmail.com
              </a>{" "}
              for any questions.
            </p>
          </div>
        </motion.section>
      </main>

      <footer className="w-full bg-espresso px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-background/70">
            Project Resource Map is an independent resource directory and is
            not affiliated with any of the organizations listed on this
            website. We are not a medical provider and do not provide direct
            financial, legal, or medical assistance. Although we frequently
            verify resources, information may change over time, so please
            visit each organization’s website to confirm eligibility,
            availability, and program details.
          </p>
          <p className="mt-4 text-sm text-background/50">
            © 2026 Project Resource Map. Made with 🤍 for families
            everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function VerifiedSearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
      <path d="M8 11.2 10 13l3.5-3.5" />
    </svg>
  );
}

function FoldedMapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}
