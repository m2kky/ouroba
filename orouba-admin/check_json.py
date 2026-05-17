import glob, json

results = {}
for f in glob.glob('data_*.json'):
    try:
        with open(f, encoding='utf-8') as file:
            data = json.load(file)
            results[f] = len(data)
    except Exception as e:
        print(f"Error reading {f}: {e}")

for k, v in sorted(results.items()):
    print(f"{k}: {v} rows")
