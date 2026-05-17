import re
try:
    with open(r'..\campcod3_eloroba.sql', 'r', encoding='utf-8') as f:
        content = f.read()
    print('campcod3_eloroba.sql matches:', list(set(re.findall(r"INSERT INTO `([^`]+)`", content))))
except Exception as e: print(e)
