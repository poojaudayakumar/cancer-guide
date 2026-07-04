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
// Local x is the car's length axis (rear at x=7, front at x=40, a 1:2.2
// width:length body) and local y is the width axis (7 to 40, matching the
// rotation so the front bumper leads once `offsetRotate: "auto"` points it
// down the track).
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
        <radialGradient id="car-body-gradient" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#5b7ff0" />
          <stop offset="55%" stopColor="#225ee4" />
          <stop offset="100%" stopColor="#12297a" />
        </radialGradient>
        <linearGradient id="headlight-beam" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="windshield-gloss" x1="10%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="front-windshield-clip">
          <path d="M26,6.5 L26,17.5 C28,18.3 30,18.6 32,18.5 C32.6,15.5 32.6,8.5 32,5.5 C30,5.4 28,5.7 26,6.5 Z" />
        </clipPath>
        <clipPath id="rear-windshield-clip">
          <path d="M14.5,6.5 L14.5,17.5 C12.9,18.3 11.3,18.6 9.6,18.4 C9.1,15.5 9.1,8.5 9.6,5.6 C11.3,5.4 12.9,5.7 14.5,6.5 Z" />
        </clipPath>
      </defs>

      {/* ambient drop shadow, offset down/out so the chassis reads as elevated */}
      <ellipse
        cx="24.5"
        cy="12.8"
        rx="18.5"
        ry="9.5"
        fill="rgba(0,0,0,0.3)"
        style={{ filter: "blur(3px)" }}
      />

      {/* headlight beams: soft white volumetric cones, anchored under the body so
          they read as flush with the front edge once the body is painted over them */}
      <path
        d="M34,7.2 C46,6.4 53.5,4.8 61,2.4 C62.2,3.8 62.2,7.2 61,8.6 C53.5,9 46,9 34,9.2 Z"
        fill="url(#headlight-beam)"
        style={{ filter: "blur(0.8px)" }}
      />
      <path
        d="M34,16.8 C46,17.6 53.5,19.2 61,21.6 C62.2,20.2 62.2,16.8 61,15.4 C53.5,15 46,15 34,14.8 Z"
        fill="url(#headlight-beam)"
        style={{ filter: "blur(0.8px)" }}
      />

      {/* body: uniform rounded rectangle, parallel sides, clean rounded tail and nose */}
      <path
        d="M11,4.5 L33,4.5 A7,7 0 0 1 40,11.5 L40,12.5 A7,7 0 0 1 33,19.5 L11,19.5 A4,4 0 0 1 7,15.5 L7,8.5 A4,4 0 0 1 11,4.5 Z"
        fill="url(#car-body-gradient)"
        stroke="#12297a"
        strokeWidth="0.5"
      />

      {/* rear window: mirrors the front windshield's shape and gloss, widened so its
          inner edge matches the front windshield's smaller (inner) base exactly */}
      <path
        d="M14.5,6.5 L14.5,17.5 C12.9,18.3 11.3,18.6 9.6,18.4 C9.1,15.5 9.1,8.5 9.6,5.6 C11.3,5.4 12.9,5.7 14.5,6.5 Z"
        fill="#1a1a1a"
      />
      <g clipPath="url(#rear-windshield-clip)">
        <rect x="8.1" y="4.4" width="7.4" height="15.2" fill="url(#windshield-gloss)" />
      </g>

      {/* main roof panel: spans the full cabin, touching both windshields directly;
          now a uniform width since the rear window matches the front's inner base */}
      <path
        d="M14.5,6.5 L26,6.5 L26,17.5 L14.5,17.5 Z"
        fill="url(#car-body-gradient)"
        stroke="#12297a"
        strokeWidth="0.3"
      />

      {/* front windshield: largest glass element, contained fully within the body's margins */}
      <path
        d="M26,6.5 L26,17.5 C28,18.3 30,18.6 32,18.5 C32.6,15.5 32.6,8.5 32,5.5 C30,5.4 28,5.7 26,6.5 Z"
        fill="#1a1a1a"
      />
      {/* sharp diagonal gloss reflection across the windshield */}
      <g clipPath="url(#front-windshield-clip)">
        <rect x="25" y="5" width="9" height="14" fill="url(#windshield-gloss)" />
      </g>

      {/* side windows: only mildly tapered at both ends - a 0.4 unit gap from the
          body margin and a 0.5 unit gap from the roof panel */}
      <path
        d="M15,5.3 C16.5,4.95 18,4.9 20,4.9 C22,4.9 23.5,4.95 25,5.3 L25,5.6 C23.5,5.95 22,6 20,6 C18,6 16.5,5.95 15,5.6 Z"
        fill="#1a1a1a"
        opacity="0.85"
      />
      <path
        d="M15,18.4 C16.5,18.05 18,18 20,18 C22,18 23.5,18.05 25,18.4 L25,18.7 C23.5,19.05 22,19.1 20,19.1 C18,19.1 16.5,19.05 15,18.7 Z"
        fill="#1a1a1a"
        opacity="0.85"
      />

      {/* hood creases: subtle inset lines running down the hood */}
      <line x1="33" y1="9" x2="39.3" y2="9" stroke="#0f2a66" strokeWidth="0.35" opacity="0.55" />
      <line x1="33" y1="15" x2="39.3" y2="15" stroke="#0f2a66" strokeWidth="0.35" opacity="0.55" />

      {/* aerodynamic, body-colored side mirrors, slid in toward the middle of the car's length */}
      <path
        d="M25.5,4.5 C26.1,3.3 27.5,2.6 28.8,2.9 C29.2,3.6 28.8,4.6 27.8,5.1 C26.9,5.4 26,5.2 25.5,4.5 Z"
        fill="url(#car-body-gradient)"
        stroke="#12297a"
        strokeWidth="0.25"
      />
      <path
        d="M25.5,19.5 C26.1,20.7 27.5,21.4 28.8,21.1 C29.2,20.4 28.8,19.4 27.8,18.9 C26.9,18.6 26,18.8 25.5,19.5 Z"
        fill="url(#car-body-gradient)"
        stroke="#12297a"
        strokeWidth="0.25"
      />

      {/* tail lights: flush against the rear body surface, slightly shrunk */}
      <rect x="7.1" y="7.1" width="1.3" height="2.4" rx="0.6" fill="#ef4444" />
      <rect x="7.1" y="14.5" width="1.3" height="2.4" rx="0.6" fill="#ef4444" />
    </svg>
  );
}
