// ----------------------------------------------Global Variables-------------------------------------------------------------
// our requires for our node packages being stored in variables, along with the
// js file containing our api keys
var twitter = require("twitter");
var spotifyWebApi = require('spotify-web-api-node');
var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");

// grabbing the keys in keys.js and storing them in variables 
var twitterKeys = keys.twitterKeys
var spotifyKeys = keys.spotifyKeys

// sets up twitter and spotify keys within this file
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

// spotify web api package requires we set an access token
// for some reason this token breaks frequently and I have to generate a new one 
// from spotify's API console
userSpotify.setAccessToken('BQCaePAi2yMHsCrkwZ9OQLsc1W7DofLCG6RAWBuF3vjtHwBRN2FWWfImUdjjDuMw1BjOqMkHZn0sIu_AS2DJz298Y3lyzzoMkeC-GYO3_uN0mDAX8cUjxkdr0pXTrZ1_tRzfTgSH3mQaFk0XdOfCMuckVJgr1IrBuTa-nQ');
userSpotify.setRefreshToken('AQAskVBhyJRwJYCQPpDVw586k7dvXrqvUxGbxf6HXazw1zyIdv8ULCmw3gBF6Y84LOXYZBxxXTZLRL-_XEJcmn5rPVleAYSANbJoAZF7WZXlJqqsq_bY-gTY_lZP0-WwpLo');

// stores our node argument in node in variables
var apiArg = process.argv[2];
var mediaArg = JSON.stringify(process.argv[3]);

// stores our query url for use with the omdb api
var queryUrl = "http://www.omdbapi.com/?t=" + mediaArg + "&y=&plot=short&apikey=ca876342";


// paramaters stored for the twitter api
var twitterParams = {screen_name: 'fakegeekguy', count: '20'};


//----------------------------------------------------FUNCTIONS---------------------------------------------------------------

// function we use to search with teh twitter api
function twitterSearch (){
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
// function we use to search with the spotify api
function spotifySearch() {
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
  	console.log(err);
    console.log("Something went wrong! Why don't you try this song?");
    console.log("Artist name: Ace of Base");
    console.log("Song name: The Sign");
    console.log("Preview URL: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=8897482848704f2a8f8d7c79726a70d4");
  });
}

// function we use to search the omdb api 
function omdbSearch() {
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
	  	console.log("You didn't enter a movie title, may I suggest this one?")
	  	console.log("Title: Mr. Nobody");
	    console.log("Release Year: 2013");
	    console.log("IMDB Rating: 7.9/10");
	    console.log("Country: Belgium, Germany, Canada, France, USA, UK");
	    console.log("Language: English, Mohawk");
	    console.log("Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible");
	    console.log("Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham");
	    console.log("Website: http://www.magpictures.com/mrnobody/");
	  }
}

// --------------------------------------------------Argument Inputs------------------------------------------------------------------
// handles the arguments being sent to our bot
if (apiArg === "my-tweets") {
		//calls our twitterSearch function 
		twitterSearch();
} else if (apiArg === "spotify-this-song"){
	// calls our spotifySearch fucntion
	spotifySearch();
	
} 
else if (apiArg === "movies-this") {
	// calls our omdbSearch function
	omdbSearch();
	
} else if (apiArg === "do-what-it-says") {
	// reads our random.txt file
	fs.readFile("random.txt", "utf8", function(error, data) {

  
  if (error) {
    return console.log(error);
  }

  // splits the data on random.txt into an array
  var dataArr = data.split(",");

  
  // changes mediaArg's value to that of the object at index [1] of the data.Arr
  mediaArg = dataArr[1];
  
  // calls our spotifySearch function, which will take in the value mediaArg set at line 142
  // and use that value in the search. 
  spotifySearch();

});

} 
