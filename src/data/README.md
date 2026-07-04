# Adding resources

`resources.json` is the live data for the Resource Directory (`/resources`). To add a new
resource, open `resources.json` and append a new object to the array — no code changes
needed. See `resources.example.json` for full example entries in the exact shape expected.

## Fields

| Field           | Type              | Notes |
|-----------------|-------------------|-------|
| `id`            | string            | Unique, lowercase, hyphenated (e.g. `"my-new-resource"`). |
| `name`          | string            | Organization/program name. |
| `cancerTypes`   | string[]          | See "Cancer types" below. |
| `categories`    | string[]          | Must exactly match one or more of the categories listed below. |
| `cost`          | string            | Must be exactly `"Free"` or `"< $25"`. |
| `location`      | string            | Human-readable summary shown on the card (e.g. `"New Hampshire, Vermont"`, `"Virtual"`, `"All 50 states"`). |
| `states`        | string[]          | Full state names (e.g. `"Ohio"`, `"Puerto Rico"`). Leave empty `[]` for nationwide/virtual-only resources. |
| `isNationwide`  | boolean           | Powers the "Nationwide" location filter. |
| `isVirtual`     | boolean           | Powers the "Virtual" location filter. |
| `description`   | string            | One sentence shown on the card. |
| `requirements`  | string            | Eligibility notes. Leave `""` if none. |
| `website`       | string            | Leave `""` if none — the button only shows when present. |
| `email`         | string            | Leave `""` if none. |
| `phone`         | string            | Leave `""` if none. |
| `additionalInfo`| string            | Not shown on the card; free-form notes. |

## Categories (must match exactly)

The sidebar has fixed checkboxes for these 8 categories. A resource can list more than one.
Any other string will still save fine but won't have a matching filter checkbox:

- Emotional Support and Wellbeing
- Finance Assistance
- Food and Nutrition
- Housing/Lodging
- Informational
- Medicine/Medical
- Transportation
- Wigs and Appearance

## Cancer types

The sidebar's Cancer Type toggle is just "All" vs "Pancreatic":

- `"All"` — a general resource relevant to anyone, regardless of cancer type.
- `"Pancreatic"` — shown when the "Pancreatic" filter is selected (resources tagged `"All"` also stay visible in that view).
- Other values (e.g. `"Breast"`) are fine to add and will still display normally, they just won't have their own dedicated toggle button yet.

## States

Unlike categories, the state checkboxes in the sidebar are generated automatically from
whatever appears in every resource's `states` array — so adding a new state name here just
works, no code changes required.

## Cost

Must be exactly `"Free"` or `"< $25"` — these two exact strings are what the Cost filter
buttons match against.
