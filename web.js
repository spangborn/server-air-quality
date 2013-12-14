var express = require('express');
var http = require('http');
var url = require('url');
var app = express();


var airQuality = {
  "api" : {
    "host" : "www.airnowapi.org",
    "endpoint" : "/aq/observation/latLong/current/?format=application/json",
    "apiKey" : process.env.API_KEY
  }
};

function getAirQuality(req,res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  
  // Send the HTTP request to AirNow  
  var options = {
    "host" : airQuality.api.host,
    "path" : airQuality.api.endpoint + "&latitude=" + query.latitude + "&longitude=" + query.longitude + "&distance=" + query.distance + "&API_KEY=" + airQuality.api.apiKey
  };
  
  callback = function(response) {
    var str = '';
  
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(str);
      console.log(str);
    })
  }
  http.request(options, callback).end();
};


app.use(express.logger());

app.get('/getAirQuality', function (request, response) {
  getAirQuality(request, response);
});
app.get('/', function (request, response) {
	response.end("You should get a Pebble. -s");
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port + " API KEY: " + process.env.API_KEY);
});