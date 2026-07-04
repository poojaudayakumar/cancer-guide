"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MapPinIcon } from "@/components/MapPinIcon";

// Wide and short: the asphalt itself (see the strokeWidth below) fills
// almost the entire track width, so the path only needs a gentle sway
// rather than wide left-right swings.
const TRACK_WIDTH = 400;
const TRACK_HEIGHT = 1400;

const ROAD_PATH =
  "M200,0 C195,50 180,100 185,160 C195,280 205,500 215,700 C225,900 175,1100 185,1240 C190,1320 195,1370 200,1400";

// Same curve as ROAD_PATH, shifted 60px left so the car rides the left half
// of the (340px-wide) asphalt instead of the centerline. Shifting the whole
// path — rather than adding a transform on the car — keeps the tangent
// direction identical at every point, so `offsetRotate: "auto"` still
// orients the car correctly through every curve.
const CAR_PATH =
  "M140,0 C135,50 120,100 125,160 C135,280 145,500 155,700 C165,900 115,1100 125,1240 C130,1320 135,1370 140,1400";

type Milestone = {
  id: string;
  x: number;
  y: number;
  progress: number;
  side: "left" | "right";
  step: string;
  detail: string;
  visual: ReactNode;
};

const MILESTONES: Milestone[] = [
  {
    id: "categories",
    x: 185,
    y: 160,
    progress: 0.11,
    side: "right",
    step: "Step 1",
    detail:
      "Explore categories like Financial Aid, Transportation, or Support Groups.",
    visual: <CategoryVisual />,
  },
  {
    id: "filters",
    x: 215,
    y: 700,
    progress: 0.5,
    side: "left",
    step: "Step 2",
    detail:
      "Filter the directory by your location and specific cancer type.",
    visual: <FilterVisual />,
  },
  {
    id: "connect",
    x: 185,
    y: 1240,
    progress: 0.89,
    side: "right",
    step: "Step 3",
    detail:
      "Connect directly with trusted organizations to get the care you need.",
    visual: <ConnectVisual />,
  },
];

export default function RoadJourney() {
  return (
    <>
      <DesktopJourney />
      <MobileJourney />
    </>
  );
}

function DesktopJourney() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  // Smooths the raw scroll signal with a spring so the car trails the
  // scroll input with gentle inertia instead of snapping to it instantly.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.6,
  });
  const carDistance = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative mx-auto hidden max-w-[92rem] px-6 md:block">
      <div ref={stageRef} className="relative mx-auto" style={{ height: TRACK_HEIGHT }}>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
        >
          <svg
            viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}
            width={TRACK_WIDTH}
            height={TRACK_HEIGHT}
            className="absolute inset-0"
            aria-hidden="true"
          >
            <path
              d={ROAD_PATH}
              fill="none"
              stroke="var(--color-foreground)"
              strokeOpacity={0.15}
              strokeWidth={380}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "blur(24px)" }}
            />
            <path
              d={ROAD_PATH}
              fill="none"
              stroke="var(--color-foreground)"
              strokeWidth={340}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={ROAD_PATH}
              fill="none"
              stroke="var(--color-background)"
              strokeOpacity={0.85}
              strokeWidth={5}
              strokeDasharray="28 30"
              strokeLinecap="round"
            />
          </svg>

          {/* Car width is roughly half the asphalt's 340px width. */}
          <motion.div
            className="absolute left-0 top-0 h-[85px] w-[170px]"
            style={{
              offsetPath: `path("${CAR_PATH}")`,
              offsetDistance: carDistance,
              offsetRotate: "auto",
              offsetAnchor: "50% 50%",
            }}
          >
            <CarIcon
              className="h-full w-full"
              style={{
                filter:
                  "drop-shadow(0 3px 6px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(14,165,233,0.6))",
              }}
            />
          </motion.div>

          {MILESTONES.map((milestone) => (
            <MilestonePin
              key={milestone.id}
              milestone={milestone}
              scrollYProgress={smoothProgress}
            />
          ))}
        </div>

        {MILESTONES.map((milestone) => (
          <div
            key={milestone.id}
            className="absolute w-[25rem] -translate-y-1/2"
            style={{
              top: milestone.y,
              ...(milestone.side === "right"
                ? { left: `calc(50% + ${TRACK_WIDTH / 2 + 48}px)` }
                : { right: `calc(50% + ${TRACK_WIDTH / 2 + 48}px)` }),
            }}
          >
            <MilestoneCard milestone={milestone} />
          </div>
        ))}
      </div>

      <div className="mt-32 flex justify-center">
        <Link
          href="/resources"
          className="animate-breathe rounded-full bg-eucalyptus px-10 py-5 text-xl font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-eucalyptus-dark hover:shadow-md"
        >
          Find resources
        </Link>
      </div>
    </div>
  );
}

function MilestonePin({
  milestone,
  scrollYProgress,
}: {
  milestone: Milestone;
  scrollYProgress: MotionValue<number>;
}) {
  const proximity = useTransform(
    scrollYProgress,
    [
      milestone.progress - 0.09,
      milestone.progress - 0.02,
      milestone.progress + 0.02,
      milestone.progress + 0.09,
    ],
    [0, 1, 1, 0],
  );
  const [active, setActive] = useState(false);
  useMotionValueEvent(proximity, "change", (v) => setActive(v > 0.5));

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-[85%]"
      style={{ left: milestone.x, top: milestone.y }}
      animate={active ? { y: [0, -10, 0] } : { y: 0 }}
      transition={
        active
          ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.25 }
      }
    >
      <MapPinIcon
        className="h-16 w-16 drop-shadow-[0_4px_10px_rgba(236,64,122,0.5)]"
        fill="#ec407a"
      />
    </motion.div>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <div className="rounded-2xl border border-eucalyptus/15 bg-white/75 p-9 shadow-lg backdrop-blur-sm">
      <p className="text-lg font-medium leading-relaxed text-foreground/90">
        <span className="font-bold text-eucalyptus">{milestone.step}:</span>{" "}
        {milestone.detail}
      </p>
      <div className="mt-6 rounded-xl border border-foreground/10 bg-background p-5">
        {milestone.visual}
      </div>
    </div>
  );
}

function MobileJourney() {
  return (
    <div className="mx-auto max-w-md space-y-10 px-6 md:hidden">
      {MILESTONES.map((milestone, index) => (
        <motion.div
          key={milestone.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <MapPinIcon
              className="h-14 w-14 shrink-0 drop-shadow-[0_4px_10px_rgba(236,64,122,0.5)]"
              fill="#ec407a"
            />
            {index < MILESTONES.length - 1 && (
              <span className="mt-2 w-px flex-1 bg-eucalyptus/20" />
            )}
          </div>
          <MilestoneCard milestone={milestone} />
        </motion.div>
      ))}

      <div className="flex justify-center pt-16">
        <Link
          href="/resources"
          className="animate-breathe rounded-full bg-eucalyptus px-10 py-5 text-xl font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-eucalyptus-dark hover:shadow-md"
        >
          Find resources
        </Link>
      </div>
    </div>
  );
}

function CategoryVisual() {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full border border-eucalyptus/30 bg-eucalyptus/10 px-3 py-1.5 text-xs font-medium text-eucalyptus-dark">
        Financial Aid
      </span>
      <span className="rounded-full border border-dusty-rose/40 bg-dusty-rose/15 px-3 py-1.5 text-xs font-medium text-chocolate">
        Transportation
      </span>
      <span className="rounded-full border border-eucalyptus-light/50 bg-eucalyptus-light/20 px-3 py-1.5 text-xs font-medium text-eucalyptus-dark">
        Support Groups
      </span>
      <span className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-xs font-medium text-foreground/50">
        +12 more
      </span>
    </div>
  );
}

function FilterVisual() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-full border border-foreground/15 bg-background px-3.5 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/30" />
        <span className="h-2 w-24 rounded-full bg-foreground/10" />
      </div>
      <label className="flex items-center gap-2.5 text-xs text-foreground/60">
        <span className="h-3.5 w-3.5 rounded-[4px] border border-eucalyptus bg-eucalyptus/25" />
        Ohio
      </label>
      <label className="flex items-center gap-2.5 text-xs text-foreground/60">
        <span className="h-3.5 w-3.5 rounded-[4px] border border-dusty-rose bg-dusty-rose/25" />
        Breast Cancer
      </label>
      <label className="flex items-center gap-2.5 text-xs text-foreground/40">
        <span className="h-3.5 w-3.5 rounded-[4px] border border-foreground/20" />
        Within 25 miles
      </label>
    </div>
  );
}

function ConnectVisual() {
  return (
    <div className="rounded-lg border border-eucalyptus/20 bg-background p-4">
      <div className="mb-2.5 h-2.5 w-28 rounded-full bg-foreground/20" />
      <div className="mb-1.5 h-2 w-full rounded-full bg-foreground/10" />
      <div className="mb-4 h-2 w-2/3 rounded-full bg-foreground/10" />
      <span className="inline-block rounded-full bg-eucalyptus px-3.5 py-1.5 text-xs font-semibold text-white">
        Contact
      </span>
    </div>
  );
}

// Aerial (top-down) car: hood/windshield on the right (local +x), so it
// lines up with the direction of travel under `offsetRotate: "auto"`.
function CarIcon({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 48 24"
      className={className}
      style={{ ...style, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="headlight-glow" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* headlight beams: soft, elongated cones fading ahead of the nose */}
      <polygon
        points="43,9 66,1.5 66,10.5"
        fill="url(#headlight-glow)"
        style={{ filter: "blur(1.4px)" }}
      />
      <polygon
        points="43,15 66,13.5 66,22.5"
        fill="url(#headlight-glow)"
        style={{ filter: "blur(1.4px)" }}
      />
      {/* body */}
      <rect
        x="4"
        y="5"
        width="40"
        height="14"
        rx="7"
        fill="#0ea5e9"
        stroke="#0369a1"
        strokeWidth="1.5"
      />
      {/* roof */}
      <rect x="13" y="7.5" width="15" height="9" rx="3" fill="#7dd3fc" />
      {/* windshield (hood side) */}
      <rect x="29" y="7.5" width="4" height="9" rx="1.5" fill="#0c4a6e" />
      {/* rear window */}
      <rect x="8" y="7.5" width="4" height="9" rx="1.5" fill="#0c4a6e" />
      {/* wheels */}
      <rect x="7" y="1.5" width="6" height="3.5" rx="1.5" fill="var(--color-foreground)" />
      <rect x="7" y="19" width="6" height="3.5" rx="1.5" fill="var(--color-foreground)" />
      <rect x="31" y="1.5" width="6" height="3.5" rx="1.5" fill="var(--color-foreground)" />
      <rect x="31" y="19" width="6" height="3.5" rx="1.5" fill="var(--color-foreground)" />
      {/* headlights */}
      <circle cx="43" cy="9" r="1.2" fill="#fef9c3" />
      <circle cx="43" cy="15" r="1.2" fill="#fef9c3" />
    </svg>
  );
}
