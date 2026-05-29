#import cv2
#import numpy as np
import requests
from bs4 import BeautifulSoup

#defining the function
def compare_dom_elements(url1, url2):
    #getting the html content from the two urls
    response1 = requests.get(url1)
    response2 = requests.get(url2)
    html1 = response1.text
    html2 = response2.text
    
    #parsing the html content
    soup1 = BeautifulSoup(html1, 'html.parser')
    soup2 = BeautifulSoup(html2, 'html.parser')
    
    #getting the DOM elements from the two urls
    dom_elements1 = soup1.find_all()
    dom_elements2 = soup2.find_all()
    
    #comparing the DOM elements
    diff_elements = []
    for element1 in dom_elements1:
        found = False
        for element2 in dom_elements2:
            if element1 == element2:
                found = True
                break
        if not found:
            diff_elements.append(element1)
    
    #printing the different elements
    print("The different elements between the two urls are:")
    for element in diff_elements:
        print(element)

#calling the function
compare_dom_elements('https://www.qa.com/', 'https://www.stg.com/')