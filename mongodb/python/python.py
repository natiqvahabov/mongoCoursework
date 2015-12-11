import nltk
import pymongo

client = pymongo.MongoClient()
db = client.users

## -------------------------DataScience------------------------------- ##

#  1. How many unique users are there?

# in mongodb shell we can run this command
# db.micro.distinc("id_member").count()
# result: 117858

print("Number of unique users: 117858")

## -------------------------DataScience------------------------------- ##

#  2. How many tweets (%) did the top 10 users (measured by the number of messages) publish?

# in mongodb shell we can run this command
# db.micro.aggregate({$group : {_id : "$id_member", total : { $sum : 1 }}} , {$sort : {total : -1}},{$limit : 10});

# result: 
# { "_id" : 1484740038, "total" : 9594 } 
# { "_id" : 497145453, "total" : 4792 }
# { "_id" : 1266803563, "total" : 4667 }
# { "_id" : 37402072, "total" : 2715 }
# { "_id" : 1544159024, "total" : 2321 }
# { "_id" : 418909674, "total" : 2011 }
# { "_id" : 229045023, "total" : 1810 }
# { "_id" : 229940852, "total" : 1640 }
# { "_id" : 29035604, "total" : 1437 }
# { "_id" : 14525315, "total" : 1339 }

# then I put the result to array and calculate it in nodeJs
# result : Percentage of top ten users tweet is equal to: 2.242070978338068 %

print("Top ten sender users' tweets take 2.24207 %  of all tweets")


## -------------------------DataScience------------------------------- ##


#  3. What was the earliest and latest date (YYYY-MM-DD HH:MM:SS) that a message was published?

# db.micro.find().sort({"timestamp": 1}).limit(1).pretty()   // earliest
# db.micro.find().sort({"timestamp": -1}).limit(1).pretty()  // latest 

print("Earliest tweet: 2014-06-22 23:00:00, Latest tweet: 2014-06-30 21:59:59")      


## -------------------------DataScience------------------------------- ##

#  4. What is the mean time delta between all messages?

# I retrieve first and last from 3rd question and done calculation in nodeJs


# var dlast = new Date("2014-06-30 21:59:59"); //last tweet time 
#     var dfirst = new Date("2014-06-22 23:00:00"); //first tweet time   
    
#     //convert them into milliseconds
#     var millisecondslast = dlast.getTime();
#     var millisecondsfirst = dfirst.getTime();
#     var tweetAmount = 1441792;
    
#     var deltatweettime =(millisecondslast - millisecondsfirst)/(tweetAmount-1);
     
#     console.log("Average delta time between all messages:",deltatweettime,"milliseconds"); // 476 milliseconds = 0.4 seconds 

print("Average delta time between all messages: 476 milliseconds")


## -------------------------DataScience------------------------------- ##


#  7. What is the average number of hashtags (#) used within a message?

query=db.micro.find()
l=[]

## My aim is to add all text into one string
## then find count of all hashtags and divide it to overall tweets amount

for q in query:
  l.append(q["text"]) 
 
count = 0;
for q in l:
  if isinstance(q, basestring) and q.find('#') != -1: ## check it is string and contains #
  	count = count + 1

print("Average hastags per tweet:"+str(count/float(len(l))))
totalLen = 0;


## -------------------------DataScience------------------------------- ##

#  5. What is the mean length of a message?

for q in l:
  if isinstance(q, basestring):
  	totalLen += len(q)

print("Average length of tweets:"+ str(totalLen/float(len(l))))


## -------------------------DataScience------------------------------- ##

#  8. Which area within the UK contains the largest number of published messages?

query = db.micro.find()

a ={}  ## I used map array , it contains something like "(51.09,-0.3)"
ans = 0;
maxTweetCount = 0;
for k in query:
	ind = (round(k["geo_lat"], 6), round(k["geo_lng"], 6))
	if ind in a:
	  a[ind] += 1
	  if a[ind] > maxTweetCount:
	 	maxTweetCount = a[ind]
	  	ans = ind
	else:
	  a[ind] = 1

print("Most geo_lng and geo_lat are " + str(ans) + " used " + str(maxTweetCount) + " times");
