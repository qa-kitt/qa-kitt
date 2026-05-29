#import libraries
import requests
from bs4 import BeautifulSoup

#define the url
url = 'https://rand0m.ai/'

#make a request to the url
page = requests.get(url)

#parse the html
soup = BeautifulSoup(page.content, 'html.parser')
print(soup)
#initialize the score
score = 0

#check for alt tags on images
images = soup.find_all('img')

for image in images:
    if image.has_attr('alt'):
        score += 10
print(f'There are {images} images with an alt reference')

#check for headings
headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
for heading in headings:
    score += 10
print(f'There are {images} h1-h6 references')

#check for aria-label
labels = soup.find_all('[aria-label]')
for label in labels:
    score += 10
print(f'There are {images} aria-label.')

#check for aria-labelledby
labelledby = soup.find_all('[aria-labelledby]')
for labelled in labelledby:
    score += 10
print(f'There are {labelledby} aria-labelledby.')

#calculate the score
score = int(score) / (len(images) + len(headings) + len(labels) + len(labelledby)) * 100

#print the score
print(f'The score is: ' + str(score) + '%')