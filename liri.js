/*
    Al Curry          February 27, 2018
    
    GWU Full Stack Web Development coding bootcamp

    Node JS homework 1 - "LIRI"
          Language Interpretation and Recognition Interface
          Set up environment variables and packages needed to 
          accept commands to extract data from spotify, twitter, and OMDB.

          npm packages must be installed :
              npm install dotenv
              npm install node-spotify-api
              npm install twitter
              npm install request
*/

require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");

var request = require("request");

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var argument = process.argv[3];

// for this command, read the random.txt file and use its content as the command and argument
if (command === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {

    // log any errors to the console
    if (error) {
      return console.log("ERR:" + error);
    }

    // parse the data on comma, creating an array, then assumed to be command and argument
    var dataArr = data.split(",");
    command = dataArr[0];
    argument = dataArr[1];

    processCommand(command, argument);
  });
} else {
  processCommand(command, argument);
}

function processCommand(command, argument) {

  switch (command) {
    case 'spotify-this-song':
      argument = argument == null ? "The Sign" : argument;
      spotify.search({ type: 'track', query: argument }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        /*  
        print :     
         Artist(s)
        The song's name
        A preview link of the song from Spotify
        The album that the song is from 
      ----  ES5 format : 
        console.log('Title: ' + data.tracks.items[0].name);
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('Album: ' + data.tracks.items[0].album.name);
        console.log('Preview link: ' + data.tracks.items[0].preview_url);
        */
        // more current ES6 format : 
        console.log(`Title: ${data.tracks.items[0].name}`);
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`);
        console.log(`Preview link: ${data.tracks.items[0].preview_url}
        `);
      });
      break;
    case 'do-what-it-says':
      break;
    case 'movie-this':
      //  run a request to the OMDB API with the movie specified

      var queryUrl = "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=trilogy";

      // create a request to the queryUrl
      request(queryUrl, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

          // Parse the body of the site and print the requested fields
          console.log("title: " + JSON.parse(body).Title);
          console.log("year: " + JSON.parse(body).Year);
          console.log("imdb rating: " + JSON.parse(body).Ratings[0].Value);
          console.log("rotten tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
          console.log("country: " + JSON.parse(body).Country);
          console.log("language: " + JSON.parse(body).Language);
          console.log("plot: " + JSON.parse(body).Plot);
          console.log("actors: " + JSON.parse(body).Actors);
        }
      });
      break;
    case 'my-tweets':
      var params = { screen_name: 'stoptwe55788730' };
      client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
          var i = 0;
          while (i < 20 && i < tweets.length) {
            console.log(tweets[i].text);
            i++;
          }
        }
      });
      break;
  }
}  

