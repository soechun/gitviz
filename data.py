import scrapy
import json
import re
class gitSpider(scrapy.Spider):
    name = 'gitviz spider'
    start_urls = ['https://api.github.com/repositories/2325298/commits?since=2017-02-01&until=2018-02-28']
    
    # def start_requests():

    def parse(self, response):
        json_res = json.loads(response.body_as_unicode())
        next_page = str(response.headers['Link']).split(',')[0]
        url = re.search('https:\/\/[A-Za-z.\/0-9?=\-\&]*', next_page)
        for item in json_res:
            main = item['commit']['author']
            repoistory='linux'
            commit_time= item['commit']['author']['date'] if main else 'null'
            author= item['commit']['author']['name'] if main else 'null'
            email = item['commit']['email']
            isOwner= item['author']['site_admin'] if item['author'] else False
            output = {
                'repository': repoistory,
                'commit_time': commit_time,
                'author': author,
                'email': email,
                'isOwner': isOwner
            }
            yield output
        if url:
            url = url.group(0)
            #yield response.follow(url, self.parse)
