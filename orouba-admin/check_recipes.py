import requests
from bs4 import BeautifulSoup
import json

url = "https://oroubafoods.com/recipes/ar"
try:
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    recipes = []
    # Let's just find everything that looks like a recipe.
    # We will search for all images that could be recipes, or links.
    for link in soup.find_all('a', href=True):
        if '/Recipe/' in link['href']:
            recipes.append(link['href'])
            
    print(f"Found {len(set(recipes))} recipe links")
    for r in set(recipes):
        print(r)
except Exception as e:
    print(e)
