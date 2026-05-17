import re, json

def parse_sql(filename):
    tables = {}
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to find INSERT statements
    inserts = re.findall(r"INSERT INTO `([^`]+)` \(([^)]+)\) VALUES\s*(.+?);", content, re.DOTALL)
    for table_name, cols_str, values_str in inserts:
        cols = [c.strip('` \n\r') for c in cols_str.split(',')]
        
        rows = []
        in_string = False
        escape = False
        current_val = []
        current_char = []
        
        i = 0
        while i < len(values_str):
            c = values_str[i]
            if not in_string:
                if c == '(':
                    current_val = []
                elif c == ')':
                    current_val.append(''.join(current_char).strip())
                    current_char = []
                    rows.append(current_val)
                    current_val = []
                elif c == ',':
                    current_val.append(''.join(current_char).strip())
                    current_char = []
                elif c == "'":
                    in_string = True
            else:
                if escape:
                    current_char.append(c)
                    escape = False
                elif c == '\\':
                    current_char.append(c)
                    escape = True
                elif c == "'":
                    if i + 1 < len(values_str) and values_str[i+1] == "'":
                        current_char.append("'")
                        i += 1
                    else:
                        in_string = False
                else:
                    current_char.append(c)
            i += 1
            
        if table_name not in tables: tables[table_name] = []
        for r in rows:
            if len(r) == len(cols):
                # Clean up NULLs and strings
                cleaned_row = {}
                for k, v in zip(cols, r):
                    if v.upper() == 'NULL':
                        cleaned_row[k] = None
                    elif v.startswith("'") and v.endswith("'"):
                        cleaned_row[k] = v[1:-1]
                    else:
                        cleaned_row[k] = v
                tables[table_name].append(cleaned_row)
                
    return tables

tables = parse_sql(r'..\campcod3_eloroba.sql')

# Clean out old data if user asks for specific tables
target_tables = [
    'brands', 'types', 'products', 'recipes', 'category_types', 'banners',
    'certifications', 'standers', 'values', 'why_chooses', 'buildings',
    'features', 'continents', 'collaborates', 'joins', 'contacts',
    'site_infos', 'socials', 'production_steps', 'section_texts',
    'product_images', 'categories', 'category_products', 'cooks', 'food', 'food_steps'
]

for t in target_tables:
    if t in tables:
        with open(f'data_{t}.json', 'w', encoding='utf-8') as f:
            json.dump(tables[t], f, ensure_ascii=False, indent=2)
        print(f'Extracted {len(tables[t])} rows for {t}')
    else:
        print(f'Table {t} not found in dump')
