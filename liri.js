var twitter = require("twitter");
var spotifyWebApi = require('spotify-web-api-node');
var keys = require("./keys.js");
var request = require("request");

var twitterKeys = keys.twitterKeys
var spotifyKeys = keys.spotifyKeys

var userTwit = new twitter ({
	consumer_key: twitterKeys.consumer_key,
  	consumer_secret: twitterKeys.consumer_secret,
  	access_token_key: twitterKeys.access_token_key,
  	access_token_secret: twitterKeys.access_token_secret,
})

var userSpotify = new spotifyWebApi ({
	clientId : spotifyKeys.clientId,
  	clientSecret : spotifyKeys.clientSecret,
})
userSpotify.setAccessToken('BQB_3kJANp3C7NtSIonEXh8N1Mcg9ohVdA9smbEPwOsQGm2UCoKib6PnqqMur7vNoQkAK6vJgwMverxFO1CZ4w5JeJiL-kmevj7C472jG_bxzI6UpxsHgqzndIqTfvFSUOy0KUMgxeQDcNxCoA');

var apiArg = process.argv[2];
var mediaArg = JSON.stringify(process.argv[3]);

var queryUrl = "http://www.omdbapi.com/?t=" + mediaArg + "&y=&plot=short&apikey=ca876342";



var twitterParams = {screen_name: 'fakegeekguy', count: '20'};

if (apiArg === "my-tweets") {
		userTwit.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
	  if (!error) {
	  	for(i=0; i<tweets.length; i++) {
	    	console.log([i+1] + ": " + tweets[i].text);
	  	}
	  } else {
	  	console.log(error);
	  }
	});
} else if (apiArg === "spotify-this-song"){
	userSpotify.searchTracks('track:' + mediaArg, {limit: 1})
  .then(function(data) {
  	for (i=0; i<data.body.tracks.items[0].artists.length; i++) {
    	console.log("Artist " + [i+1] + "'s " + "name: " + data.body.tracks.items[0].artists[i].name);
  	}
    console.log("Song name: " + data.body.tracks.items[0].name);
    if (data.body.tracks.items[0].preview_url != undefined) {
    	console.log("Preview URL: " + data.body.tracks.items[0].preview_url);
    } else {
    	console.log("Preview URL: N/A");
    }
    
    console.log("Album: " + data.body.tracks.items[0].album.name )
  }, function(err) {
    console.log("Something went wrong! Why don't you try this song?");
    console.log("Artist name: Ace of Base");
    console.log("Song name: The Sign");
    console.log("Preview URL: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=8897482848704f2a8f8d7c79726a70d4");
  });
} else if (apiArg === "movies-this") {
	if (mediaArg != null) {
		request(queryUrl, function(error, response, body) {

	  
	  if (!error && response.statusCode === 200) {

	    
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Year: " + JSON.parse(body).Year);
	    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
	    console.log("Country: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors);
	    console.log("Website: " + JSON.parse(body).Website);

	  } else {
	  	console.log(error);
	  }
	 });
	}	else{
	  	
	  	console.log("Title: Mr. Nobody");
	    console.log("Release Year: 2013");
	    console.log("IMDB Rating: 7.9/10");
	    console.log("Country: Belgium, Germany, Canada, France, USA, UK");
	    console.log("Language: English, Mohawk");
	    console.log("Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible");
	    console.log("Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham");
	    console.log("Website: http://www.magpictures.com/mrnobody/");
	  }
	
} else if (apiArg === "do-what-it-says") {
	
}