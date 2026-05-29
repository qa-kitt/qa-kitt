import requests
from bs4 import BeautifulSoup

#url of the webpage
url = 'https://rand0m.ai/'

#get the webpage
page = requests.get(url)

#parse the webpage
soup = BeautifulSoup(page.content, 'html.parser')

#find all the links
links = soup.find_all('a')

#iterate through the links
for link in links:
    #get the href attribute of the link
    href = link.get('href')
    #check if the link is valid
    if requests.get(href).status_code != 200:
        #if the link is not valid, print it
        print(href)