from time import sleep
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from chromedriver_py import binary_path # this will get you the path variable

from bs4 import BeautifulSoup



url = 'https://www.ebay.com/itm/115916733294?_trksid=p4375194.c101959.m146925'#'https://www.ikea.com/ca/en/p/aptitlig-butcher-block-bamboo-00233429/' #'https://www.bestbuy.ca/en-ca/product/sonos-arc-5-0-2-channel-smart-soundbar-with-dolby-atmos-black/14597172' #'https://www.amazon.ca/-/fr/Logitech-correction-fonctionne-FaceTime-ordinateur/dp/B085TFF7M1?pd_rd_w=TXdKP&content-id=amzn1.sym.132f1a2b-de6d-4eb4-9982-d6fe080f8827%3Aamzn1.symc.40e6a10e-cbc4-4fa5-81e3-4435ff64d03b&pf_rd_p=132f1a2b-de6d-4eb4-9982-d6fe080f8827&pf_rd_r=FW3WWNN5X1JDZQ655DRH&pd_rd_wg=vw1fW&pd_rd_r=4042ee3a-ae05-4d58-b87f-445b732bf6a2&pd_rd_i=B085TFF7M1&th=1'


if __name__ == "__main__":
    r = requests.get(url)

    # Parsing the HTML
    soup = BeautifulSoup(r.content, 'html.parser')

    s = soup.find('span', class_='pip-price__sr-text')
    content = soup.find_all('p')

    print(content)