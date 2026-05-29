import requests
from bs4 import BeautifulSoup

# Get the page
url = 'https://rand0m.ai/'
page = requests.get(url)

# Parse the page
soup = BeautifulSoup(page.content, 'html.parser')

# Get the page load speed
load_time = page.elapsed.total_seconds()
print('Page load speed:', load_time)

# Get all API endpoints referenced in the DOM
api_endpoints = []
for link in soup.find_all('a'):
    href = link.get('href')
    if href.startswith('/api/'):
        api_endpoints.append(href)

# Print the list of API endpoints
print('API endpoints:')
for endpoint in api_endpoints:
    print(endpoint)