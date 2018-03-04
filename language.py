import scrapy
import json
import re
class gitSpider(scrapy.Spider):
    name = 'gitviz spider'
    user = 'torvalds'
    repos_link = 'https://api.github.com/users/'+ user + '/repos'
    start_urls = [repos_link]
    
    # def start_requests():

    def parse(self, response):
        json_res = json.loads(response.body_as_unicode())
        first = type(json_res) is list
        if first:
            for item in json_res:
                yield response.follow(item['languages_url'], self.parse)
        else:
            reply = {}
            reply['repo'] = response.url.split('/')[5]
            for key in json_res:
                reply['language'] = key
                reply['byte_count'] = json_res[key]
                yield reply