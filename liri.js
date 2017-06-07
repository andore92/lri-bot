var twitter = require("twitter");
var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys

var userTwit = new twitter ({
	consumer_key: twitterKeys.consumer_key,
  	consumer_secret: twitterKeys.consumer_secret,
  	access_token_key: twitterKeys.access_token_key,
  	access_token_secret: twitterKeys.access_token_secret,
})
	


var userInput = process.argv[2];
var twitterParams = {screen_name: 'fakegeekguy', count: '20'};

if (userInput === "my-tweets") {
		userTwit.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
	  if (!error) {
	  	for(i=0; i<tweets.length; i++) {
	    	console.log([i+1] + ": " + tweets[i].text);
	  	}
	  } else {
	  	console.log(error);
	  }
	});
}