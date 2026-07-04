"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import rawResources from "@/data/resources.json";
import { MapPinIcon } from "@/components/MapPinIcon";

interface Resource {
  id: string;
  name: string;
  cancerTypes: string[];
  categories: string[];
  cost: string;
  location: string;
  states: string[];
  isNationwide: boolean;
  isVirtual: boolean;
  description: string;
  requirements: string;
  website: string;
  email: string;
  phone: string;
  additionalInfo: string;
}

const RESOURCES = rawResources as Resource[];

const CATEGORIES = [
  "Emotional Support and Wellbeing",
  "Finance Assistance",
  "Food and Nutrition",
  "Housing/Lodging",
  "Informational",
  "Medicine/Medical",
  "Transportation",
  "Wigs and Appearance",
];

const STATES = Array.from(new Set(RESOURCES.flatMap((r) => r.states))).sort();

function toggleValue(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export default function ResourceDirectory() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [virtualOnly, setVirtualOnly] = useState(false);
  const [nationwideOnly, setNationwideOnly] = useState(false);
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [cancerType, setCancerType] = useState<"All" | "Pancreatic">("All");
  const [costFilter, setCostFilter] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return RESOURCES.filter((resource) => {
      const matchesSearch =
        !query ||
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query);

      const matchesCategory =
        categories.size === 0 ||
        resource.categories.some((category) => categories.has(category));

      const matchesLocation =
        !virtualOnly && !nationwideOnly && selectedStates.size === 0
          ? true
          : (virtualOnly && resource.isVirtual) ||
            (nationwideOnly && resource.isNationwide) ||
            resource.states.some((state) => selectedStates.has(state));

      const matchesCancerType =
        cancerType === "All" ||
        resource.cancerTypes.includes("Pancreatic") ||
        resource.cancerTypes.includes("All");

      const matchesCost = costFilter.size === 0 || costFilter.has(resource.cost);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesCancerType &&
        matchesCost
      );
    });
  }, [search, categories, virtualOnly, nationwideOnly, selectedStates, cancerType, costFilter]);

  const activeFilterCount =
    categories.size +
    selectedStates.size +
    (virtualOnly ? 1 : 0) +
    (nationwideOnly ? 1 : 0) +
    (cancerType !== "All" ? 1 : 0) +
    costFilter.size;

  function clearFilters() {
    setSearch("");
    setCategories(new Set());
    setVirtualOnly(false);
    setNationwideOnly(false);
    setSelectedStates(new Set());
    setCancerType("All");
    setCostFilter(new Set());
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-24 pt-4 md:grid-cols-[272px_1fr] md:items-start">
      <aside className="space-y-7 md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pr-2">
        <div>
          <label
            htmlFor="resource-search"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            Search
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              id="resource-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or keyword..."
              className="w-full rounded-full border border-foreground/15 bg-white/70 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/25"
            />
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-eucalyptus transition-colors hover:text-eucalyptus-dark"
          >
            Clear all filters ({activeFilterCount})
          </button>
        )}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-foreground">
            Category
          </legend>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <FilterCheckbox
                key={category}
                label={category}
                checked={categories.has(category)}
                onChange={() =>
                  setCategories((prev) => toggleValue(prev, category))
                }
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-foreground">
            Location
          </legend>
          <div className="space-y-2">
            <FilterCheckbox
              label="Virtual"
              checked={virtualOnly}
              onChange={() => setVirtualOnly((value) => !value)}
            />
            <FilterCheckbox
              label="Nationwide"
              checked={nationwideOnly}
              onChange={() => setNationwideOnly((value) => !value)}
            />
          </div>
          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-foreground/55">
            Or select a state
          </p>
          <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-xl border border-foreground/10 bg-white/40 p-3">
            {STATES.map((state) => (
              <FilterCheckbox
                key={state}
                label={state}
                checked={selectedStates.has(state)}
                onChange={() =>
                  setSelectedStates((prev) => toggleValue(prev, state))
                }
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-foreground">
            Cancer Type
          </legend>
          <div className="flex gap-2">
            <ToggleButton
              label="All"
              active={cancerType === "All"}
              onClick={() => setCancerType("All")}
            />
            <ToggleButton
              label="Pancreatic"
              active={cancerType === "Pancreatic"}
              onClick={() => setCancerType("Pancreatic")}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-foreground">
            Cost
          </legend>
          <div className="flex gap-2">
            <ToggleButton
              label="Free"
              active={costFilter.has("Free")}
              onClick={() =>
                setCostFilter((prev) => toggleValue(prev, "Free"))
              }
            />
            <ToggleButton
              label="< $25"
              active={costFilter.has("< $25")}
              onClick={() =>
                setCostFilter((prev) => toggleValue(prev, "< $25"))
              }
            />
          </div>
        </fieldset>
      </aside>

      <div>
        <p className="mb-6 text-sm text-foreground/60">
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "resource" : "resources"} found
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-eucalyptus/30 bg-white/50 p-12 text-center">
            <p className="text-base font-medium text-foreground">
              No resources match your filters.
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              Try adjusting or clearing your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-full bg-eucalyptus px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-eucalyptus-dark"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.ul
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence>
              {filtered.map((resource) => (
                <motion.li
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full"
                >
                  <ResourceCard resource={resource} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-foreground/30 accent-eucalyptus"
      />
      <span>{label}</span>
    </label>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
        active
          ? "bg-eucalyptus text-white shadow-sm hover:shadow-md"
          : "border border-foreground/15 bg-white/60 text-foreground/90 hover:border-eucalyptus/40 hover:text-foreground hover:shadow-md"
      }`}
    >
      {label}
    </button>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const isPancreatic = resource.cancerTypes.includes("Pancreatic");

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-eucalyptus/15 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-wrap gap-1.5">
        {resource.categories.map((category) => (
          <span
            key={category}
            className="rounded-full border bg-dusty-blue/40 px-2.5 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-xl"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-dusty-blue) 85%, var(--color-foreground) 15%)",
            }}
          >
            {category}
          </span>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold leading-snug text-foreground">
          {resource.name}
        </h3>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground/90">
          {resource.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span
          className={`rounded-full border px-2.5 py-1 font-medium ${
            resource.cost === "Free"
              ? "border-eucalyptus-light/50 bg-eucalyptus-light/20 text-eucalyptus-dark"
              : "border-chocolate/30 bg-chocolate/10 text-chocolate"
          }`}
        >
          {resource.cost}
        </span>
        {isPancreatic && (
          <span className="rounded-full border border-dusty-rose/40 bg-dusty-rose/15 px-2.5 py-1 font-medium text-chocolate">
            Pancreatic-specific
          </span>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-xs font-medium text-foreground/65">
        <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
        {resource.location}
      </p>

      {resource.requirements && (
        <p className="text-xs font-medium text-foreground/65">
          <span className="font-semibold text-foreground/80">
            Requirements:
          </span>{" "}
          {resource.requirements}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-4 text-sm">
        {resource.website && (
          <a
            href={resource.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-eucalyptus px-4 py-1.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-eucalyptus-dark hover:shadow-md"
          >
            Visit website
          </a>
        )}
        {resource.phone && (
          <a
            href={`tel:${resource.phone}`}
            className="text-foreground/60 underline-offset-2 hover:text-eucalyptus hover:underline"
          >
            {resource.phone}
          </a>
        )}
        {resource.email && (
          <a
            href={`mailto:${resource.email}`}
            className="text-foreground/60 underline-offset-2 hover:text-eucalyptus hover:underline"
          >
            {resource.email}
          </a>
        )}
      </div>
    </article>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
