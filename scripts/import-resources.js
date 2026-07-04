#!/usr/bin/env node
/**
 * Converts a CSV export of your resources spreadsheet into resources.json
 * and merges it with the existing entries.
 *
 * Usage:
 *   node scripts/import-resources.js path/to/new-resources.csv
 *
 * See src/data/resources-template.csv for the expected columns, and
 * src/data/README.md for the full field reference.
 */

const fs = require("fs");
const path = require("path");

const RESOURCES_JSON = path.join(__dirname, "..", "src", "data", "resources.json");
const VALID_CATEGORIES = [
  "Emotional Support and Wellbeing",
  "Finance Assistance",
  "Food and Nutrition",
  "Housing/Lodging",
  "Informational",
  "Medicine/Medical",
  "Transportation",
  "Wigs and Appearance",
];
const VALID_COSTS = ["Free", "< $25"];
const LIST_FIELDS = ["cancerTypes", "categories", "states"];
const BOOLEAN_FIELDS = ["isNationwide", "isVirtual"];
const STRING_FIELDS = [
  "id",
  "name",
  "cost",
  "location",
  "description",
  "requirements",
  "website",
  "email",
  "phone",
  "additionalInfo",
];

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function parseCsv(text) {
  // Minimal RFC-4180-ish parser: handles quoted fields, embedded commas,
  // and escaped quotes ("") inside quoted fields.
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toBoolean(value) {
  return ["true", "yes", "y", "1"].includes(String(value).trim().toLowerCase());
}

function toList(value) {
  return String(value)
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    fail("Usage: node scripts/import-resources.js path/to/new-resources.csv");
  }
  if (!fs.existsSync(csvPath)) {
    fail(`File not found: ${csvPath}`);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  if (rows.length < 2) {
    fail("CSV has no data rows (need a header row plus at least one resource).");
  }

  const headers = rows[0].map((h) => h.trim());
  const existing = JSON.parse(fs.readFileSync(RESOURCES_JSON, "utf8"));
  const existingIds = new Set(existing.map((r) => r.id));

  const warnings = [];
  const newResources = [];

  rows.slice(1).forEach((cells, rowIndex) => {
    const lineNumber = rowIndex + 2; // +1 for header, +1 for 1-indexing
    const raw = {};
    headers.forEach((header, i) => {
      raw[header] = cells[i] !== undefined ? cells[i].trim() : "";
    });

    const resource = {};

    for (const field of STRING_FIELDS) {
      resource[field] = raw[field] || "";
    }
    if (!resource.name) {
      warnings.push(`Line ${lineNumber}: missing "name" — skipping this row.`);
      return;
    }
    if (!resource.id) {
      resource.id = slugify(resource.name);
    }
    for (const field of LIST_FIELDS) {
      resource[field] = raw[field] ? toList(raw[field]) : [];
    }
    for (const field of BOOLEAN_FIELDS) {
      resource[field] = toBoolean(raw[field]);
    }

    // Validation warnings — these don't block the import, they just flag
    // rows that won't interact correctly with the site's filter UI.
    for (const category of resource.categories) {
      if (!VALID_CATEGORIES.includes(category)) {
        warnings.push(
          `Line ${lineNumber} (${resource.name}): category "${category}" doesn't match any sidebar filter exactly.`,
        );
      }
    }
    if (resource.cost && !VALID_COSTS.includes(resource.cost)) {
      warnings.push(
        `Line ${lineNumber} (${resource.name}): cost "${resource.cost}" isn't exactly "Free" or "< $25" — the Cost filter won't catch it.`,
      );
    }
    if (existingIds.has(resource.id)) {
      const original = resource.id;
      let suffix = 2;
      while (existingIds.has(`${original}-${suffix}`)) suffix++;
      resource.id = `${original}-${suffix}`;
      warnings.push(
        `Line ${lineNumber} (${resource.name}): id "${original}" already exists — renamed to "${resource.id}".`,
      );
    }

    existingIds.add(resource.id);
    newResources.push(resource);
  });

  if (newResources.length === 0) {
    console.log("No valid resources found to import — nothing was changed.");
    return;
  }

  const backupPath = RESOURCES_JSON.replace(
    ".json",
    `.backup-${Date.now()}.json`,
  );
  fs.copyFileSync(RESOURCES_JSON, backupPath);

  const merged = [...existing, ...newResources];
  fs.writeFileSync(RESOURCES_JSON, JSON.stringify(merged, null, 2) + "\n");

  console.log(`Added ${newResources.length} resource(s) to resources.json.`);
  console.log(`Backup of the previous file saved to ${path.basename(backupPath)}.`);
  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
  }
}

main();
