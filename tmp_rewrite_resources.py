from pathlib import Path
import json
import re

path = Path('src/data/resources.json')
text = path.read_text(encoding='utf-8')
lines = text.splitlines()

resources = []
current = None
current_array_key = None
array_fields = {'cancerTypes', 'categories', 'states'}


def parse_scalar(value: str):
    value = value.strip()
    if value == '[]':
        return []
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1]
    if value.lower() == 'true':
        return True
    if value.lower() == 'false':
        return False
    return value

for raw_line in lines:
    line = raw_line.strip()
    if not line or line in {'[', ']', '{', '}'}:
        continue

    if re.fullmatch(r'\d+', line):
        if current is not None and current:
            resources.append(current)
        current = {}
        current_array_key = None
        continue

    if current is None:
        current = {}

    if '\t' in line:
        parts = [p.strip() for p in line.split('\t') if p.strip()]
        if not parts:
            continue

        if len(parts) >= 2 and re.fullmatch(r'\d+', parts[0]) and current_array_key is not None:
            current[current_array_key].append(parse_scalar(parts[1]))
            continue

        if len(parts) >= 2 and parts[0] in array_fields:
            current[parts[0]] = []
            current_array_key = parts[0]
            if len(parts) > 1 and parts[1] not in {'[]', ''}:
                current[parts[0]].append(parse_scalar(parts[1]))
            continue

        if len(parts) >= 2:
            current[parts[0]] = parse_scalar(parts[1])
            current_array_key = None
            continue

    if line in array_fields:
        current[line] = []
        current_array_key = line
        continue

    if current_array_key is not None:
        current[current_array_key].append(parse_scalar(line))

if current is not None and current:
    resources.append(current)

resources = [r for r in resources if r]
path.write_text(json.dumps(resources, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

with path.open(encoding='utf-8') as f:
    data = json.load(f)
print(f'Wrote {len(data)} resources to {path}')
print('First entry id:', data[0]['id'])
print('Last entry id:', data[-1]['id'])
