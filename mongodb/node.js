//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost/users';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    // We have connected

    // Get the documents collection
    var collection = db.collection('micro');
    
    /*
    //First we need to remove minus id users
    var count = collection.find({"id_member":{$lt:0}}).count();
    if(count){
        collection.remove({"id_member":{$lt:0}});
        console.log(count," minus id users have been removed");
    }
    */
    
    
// ---------------------------------------------------------------------------------------  

  
    // 1.find the amount of distinct users
    
    // in mongo shell
    // db.micro.distinct("id_member").length;
    // returns 117858
    
    var amount = collection.distinct("id_member");
    console.log("Number of distinc users:",117858);
   
    
// ---------------------------------------------------------------------------------------


    // 2. Find percentage of top 10 users tweet

    // first we need to find top ten users with amount of tweets
    // I uses mongodb shell command
    
    /*
    db.micro.aggregate(
     { 
	      $group : {_id : "$id_member", total : { $sum : 1 }}
     },
     {
       	$sort : {total : -1}
     },
     {
	      $limit : 10
     }
    );
    */ 
    
    //  and the result is
    /*
    { "_id" : 1484740038, "total" : 9594 } 
    { "_id" : 497145453, "total" : 4792 }
    { "_id" : 1266803563, "total" : 4667 }
    { "_id" : 37402072, "total" : 2715 }
    { "_id" : 1544159024, "total" : 2321 }
    { "_id" : 418909674, "total" : 2011 }
    { "_id" : 229045023, "total" : 1810 }
    { "_id" : 229940852, "total" : 1640 }
    { "_id" : 29035604, "total" : 1437 }
    { "_id" : 14525315, "total" : 1339 }
    */

    // now do calculation process in node.js
    // I tried to get datas from mongodb shell into node.js
    // var obj = collection.aggregate({$group : {_id : "$id_member", total : { $sum : 1 }}},{$sort : {total : -1}},{$limit : 10});
    // when I run it, and show each value in object it returned "fantastic words" :) 
    // for interest I upload the result image of this row
       
    var topten = ["9594", "4792", "4667","2715","2321","2011","1810","1640","1437","1339"]; // stupid way :(
    var sum = eval(topten.join('+')); // magic calculation :)
    var totaltweet = 1441792; // I can get it like collection.find().count() but it takes so much runtimes
    
    console.log("Percentage of top ten users tweet is equal to:", (sum/totaltweet)*100,"%");

    
// ---------------------------------------------------------------------------------------    
    
    // 3. Earliest and latest date
    
    // in mongo shell
    
    // db.micro.find().sort({"timestamp": 1}).limit(1).pretty()   -- earliest    
    /*
    {
        "_id" : ObjectId("5663054f982cc47a979f3f6e"),
        "id" : NumberLong("480847701492645888"),
        "id_member" : 495413413,
        "timestamp" : "2014-06-22 23:00:00",
        "text" : "@NiamhyFoxy happy birthday gorgeous girlie hope you have a great day!?????????? xx",
        "geo_lat" : 51.43098449,
        "geo_lng" : -2.84465449
    }
    */


    // db.micro.find().sort({"timestamp": -1}).limit(1).pretty()  -- latest
    /*
    {
        "_id" : ObjectId("56630594982cc47a97a0fe8b"),
        "id" : NumberLong("483731699332022272"),
        "id_member" : 29227733,
        "timestamp" : "2014-06-30 21:59:59",
        "text" : "@Teambeatsallday @Drake Just Hold On were going home fts @50cent (rich remix) FREE DL http://t.co/rBeduVDKbB #RT",
        "geo_lat" : 53.106812,
        "geo_lng" : -2.439672
    }
    */    
    
    
    // but for getting specific date result we should use nodejs
    /*   
    collection.find().sort({"timestamp": 1}).limit(1).toArray(function (err, result) {   // -1 for earliest
      if (err) {
        console.log("adsasdadw");
      } else if (result.length) {
        console.log(result);
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
    });
    */    
    
    
// ---------------------------------------------------------------------------------------     
  
  
    // 4. Delta time between messages 
    
    var dlast = new Date("2014-06-30 21:59:59"); //last tweet time 
    var dfirst = new Date("2014-06-22 23:00:00"); //first tweet time   
    
    //convert them into milliseconds
    var millisecondslast = dlast.getTime();
    var millisecondsfirst = dfirst.getTime();
    var tweetAmount = 1441792;
    
    var deltatweettime =(millisecondslast - millisecondsfirst)/tweetAmount;
     
    console.log("Average delta time between all messages:",deltatweettime,"milliseconds"); // 476 milliseconds = 0.4 seconds 
    

// ---------------------------------------------------------------------------------------     


   // 6. Unigrams
   // I have search lots, about this topic, found only mapreduce using in mongoshell but I wait more than 2 hours, and then stop operation.
   
   /*  
    var map = function() {  
    var summary = this.text;
    if (typeof summary == "string") { 
        // quick lowercase to normalize per your requirements
        summary = summary.toLowerCase().split(" "); 
        for (var i = summary.length - 1; i >= 0; i--) {           
            if (summary[i])  {      // make sure there's something
               emit(summary[i], 1); // store a 1 for each word
            }
        }
     }
    };
    
    var reduce = function( key, values ) {    
    var count = 0;    
    values.forEach(function(v) {            
        count +=v;    
    });
    return count; 
    }
 
    db.micro.mapReduce(map, reduce, {out: "word_count"}).limit(1) 
    */
 
 
    
// --------------------------------------------------------------------------------------- 

    
    db.close();
  }
});