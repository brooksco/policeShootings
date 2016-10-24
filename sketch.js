var locations = [];
var table;
var names = "";
var namesArray = [];
var complete = false;
var scaleF = 10;
var pause = false;
var pauseCount = 0;

// var fontSize = 10;
var fontSize = 7.2;
var fontTone = 36;
var dotSize = 2;


// 4k
// var fontSize = 19.9;
// var dotSize = 4;

var showAll = false;

// Used to make screen NOT responsive, for canvas grabbing
// var lockCanvas = true;
var lockCanvas = false;
var wWidth;
var wHeight;

function preload() {
  table = loadTable("assets/fatal-police-shootings-data.csv", "csv", "header");
  // table = loadTable("https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/fatal-police-shootings-data.csv", "csv", "header");
  
  var apiKey = "AIzaSyBfDv2ODxWsEUXh0uIbKFuOX7RcaqmsQF8";
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=seattle,+wa&key=" + apiKey;

  // loadJSON(url, locationHandler);
  
  locationJSON = loadJSON("assets/locations.json");
  
  // for (var i = 0; i < locationJSON.length; i++) {
  //   names = names.concat(locationJSON[i].name + " ");
  // }
}

function setup() {
  wWidth = 1920;
  wHeight = 1080;
  
  // 4K
  // wWidth = 3840;
  // wHeight = 2160;
  
  // frameRate(30);
  frameRate(60);
  createCanvas(wWidth, wHeight);
  
  if (!lockCanvas) {
    resizeCanvas(windowWidth, windowHeight);
    wWidth = windowWidth;
    wHeight = windowHeight;
  }
  
  for (var i = 0; i < locationJSON.length; i++) {
    names = names.concat(locationJSON[i].name + " · ");
    namesArray[i] = locationJSON[i].name;
  }

  var apiKey = "AIzaSyBfDv2ODxWsEUXh0uIbKFuOX7RcaqmsQF8";
  
  var i = 0;
  var totalCalls = 1727;
  var run = false;
  
  if (run == true) {
    function locationLoop () {           //  create a loop function
      setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        
        var name = table.getString(i, 1);
        var date = table.getString(i, 2);
        var city = table.getString(i, 8);
        var state = table.getString(i, 9);
    
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ",+" + state + "&key=" + apiKey;
  
        loadJSON(url, locationHandler);
                
        i++;                     //  increment the counter
        if (i < totalCalls) {            //  if the counter < 10, call the loop function
           locationLoop();             //  ..  again which will trigger another 
        } else {
          console.log("DONE");
        }
      }, 25)
    }
  
    locationLoop();                      //  start the loop
  }

}


function locationHandler(location) {

  // Get the loaded JSON data
  locations.push({
    "city": location.results[0].address_components[0].long_name,
    "latitude": location.results[0].geometry.location.lat, 
    "longitude": location.results[0].geometry.location.lng
  });

}


var currentCount = 0;
var currentText = "";

function draw() {
  
  if (!lockCanvas) {
    wWidth = windowWidth;
    wHeight = windowHeight;
  }
  
  background(0, 0, 0);

  fill(fontTone);
  textFont("Belleza");
  textSize(fontSize);
  
  scaleF = wWidth / 135;
  delayF = 15;
  // delayF = 1;
  
  // Set a pause such that half the time is spent building the map, and an equal half showing it completed
  if (pause) {
    currentCount = locationJSON.length;
    pauseCount++;
    
    if (pauseCount == locationJSON.length * delayF) {
      pause = false;
      pauseCount = 0;
    }
    
  } else {
    // Otherwise increment the current count, respecting the delay factor
    currentCount = (frameCount / delayF) % locationJSON.length;

    if (currentCount + 1 == locationJSON.length) {
      pause = true;
    }
  }
  
  if (showAll) {
    currentCount = locationJSON.length;
  }
  
  // Put together the current list of names
  // Could be wrapped in lower loop, but may cause layering issues that need to be sorted
  currentText = "";
  for (var i = 0; i < currentCount; i++) {
    
    // Handle no dot for the first name
    if (i == 0) {
      currentText = currentText.concat(namesArray[i]);
      
    } else {
      currentText = currentText.concat(" · " + namesArray[i]);
      
    }
    
  }
  
  text(currentText.toUpperCase(), 0, 0, wWidth, wHeight);
  
  for (var i = 0; i < currentCount; i++) {

    // Need 2 conceptual translations:
    // 1) Compensate for US lat/lon values grouping in quadrant 2
    // 2) Translate compensated values to center of the window
    
    // Translate the body lat/lon values to the zero point (shifting by 40/90 feels visually weighted)
    var adjustedLat = ((locationJSON[i].latitude * scaleF) - 40 * scaleF) * -1;
    var adjustedLon = ((locationJSON[i].longitude * scaleF) + 95 * scaleF);
    
    // Translate lat/lon values to the center of the window
    adjustedLat = adjustedLat + wHeight/2;
    adjustedLon = adjustedLon + wWidth/2;
  
    var r = random(100, 255);

    fill(r, r, r, 140);
    noStroke();
    ellipse(adjustedLon, adjustedLat, dotSize, dotSize);
    // vertex(adjustedLon, adjustedLat);
  }
  
  if (video) {
    
    // Check if we're done
    if (videoCount == videoFrames) {
      video = false;
      videoCount = 0;
      
      console.log("Video complete");
      
    } else {
      var fileName = "frames/frame_" + videoCount + ".jpg";
      saveCanvas(fileName,"jpg");
      videoCount ++;
      
      console.log("Video frames: " + videoCount);
    }
    
  }

}
