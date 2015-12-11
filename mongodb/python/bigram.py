import re 
from itertools import islice, izip
from collections import Counter
import pymongo

client = pymongo.MongoClient()
db = client.users

query = db.micro.find().limit(10000)
l=""

for q in query:
	if isinstance(q["text"], basestring):
  	  l += q["text"]

words = re.findall("\w+", l)

print(Counter(izip(words, islice(words, 1, None))))

## Counter({(u't', u'co'): 4, (u'http', u't'): 3, (u'LW', u'0'): 2, (u'HW', u'5'): 2, (u'HW', u'3'): 2, (u'Wind', u'4'): 1, (u'Content', u'CurationTodays'): 1, (u'NOOOOOOOO', u'NoFilter'): 1, (u'awards', u'tonighthttp'): 1, (u'55am', u'LW'): 1, (u'26pm', u'LW'): 1, (u'Sports', u'Audi'): 1,