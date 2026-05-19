import re, json

def extract_table(filename, table_name):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parts = content.split(f"INSERT INTO `{table_name}`")
    if len(parts) < 2: return []
    
    res = []
    for part in parts[1:]:
        m_cols = re.match(r"\s*\(([^)]+)\)\s*VALUES\s*", part)
        if not m_cols: continue
        cols_str = m_cols.group(1)
        cols = [c.strip('` \n\r') for c in cols_str.split(',')]
        
        values_str = part[m_cols.end():]
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
                    j = i + 1
                    while j < len(values_str) and values_str[j] in ' \n\r':
                        j += 1
                    if j < len(values_str) and values_str[j] == ';':
                        break
                    elif j < len(values_str) and values_str[j] == ',':
                        i = j
                elif c == ',':
                    current_val.append(''.join(current_char).strip())
                    current_char = []
                elif c == "'":
                    in_string = True
                else:
                    current_char.append(c)
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
            
        for r in rows:
            if len(r) == len(cols):
                cleaned_row = {}
                for k, v in zip(cols, r):
                    if v.upper() == 'NULL':
                        cleaned_row[k] = None
                    elif v.startswith("'") and v.endswith("'"):
                        cleaned_row[k] = v[1:-1]
                    else:
                        cleaned_row[k] = v
                res.append(cleaned_row)
    return res

filename = r'D:\Codes_Projects\oruba rep\campcod3_eloroba.sql'
import os
out_dir = 'ectracted data'
os.makedirs(out_dir, exist_ok=True)

target_tables = [
    'brands', 'types', 'products', 'recipes', 'category_types', 'banners',
    'certifications', 'standers', 'values', 'why_chooses', 'buildings',
    'features', 'continents', 'collaborates', 'joins', 'contacts',
    'site_infos', 'socials', 'production_steps', 'section_texts',
    'product_images', 'categories', 'category_products', 'cooks', 'food', 
    'food_steps', 'cook_props', 'cook_images', 'food_cooks', 'category_type_categories', 'social_parents', 'contiries'
]

for t in target_tables:
    data = extract_table(filename, t)
    if data:
        with open(os.path.join(out_dir, f'data_{t}.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Extracted {len(data)} rows for {t}")
    else:
        print(f"Failed or empty for {t}")
