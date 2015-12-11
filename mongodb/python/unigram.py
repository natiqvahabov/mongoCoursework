import nltk
import pymongo
import re
from itertools import islice, izip
from collections import Counter

client = pymongo.MongoClient()
db = client.users

query = db.micro.find().limit(10000)
l=""

for q in query:
  if isinstance(q["text"], basestring):
      l += q["text"]

words = re.findall(r'\w+', l)
cap_words = [word.upper() for word in words]
word_counts = Counter(cap_words)

print(word_counts)

## Inside 10.000 tweets
## Counter({u'THE': 2718, u'TO': 2430, u'A': 2175, u'T': 2033, u'CO': 1989, u'I': 1970, u'HTTP': 1803, u'YOU': 1335, u'AND': 1309, u'IN': 1287})