var locations = [];
var table;
var names = "";
var namesArray = [];
var complete = false;
var scaleF = 10;
var pause = false;
var pauseCount = 0;

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
  
  frameRate(30)
  createCanvas(800, 600);
  resizeCanvas(windowWidth, windowHeight);
  // console.log(table.getColumn("name"));
  
  
  for (var i = 0; i < locationJSON.length; i++) {
    names = names.concat(locationJSON[i].name + " · ");
    namesArray[i] = locationJSON[i].name;
  }
  
  //cycle through the table
  // for (var r = 0; r < table.getRowCount(); r++)
  //   for (var c = 0; c < table.getColumnCount(); c++) {
  //     console.log(table.getString(r, c));
  //   }
  
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
  
        // console.log(city);
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
  // console.log(location.results[0]);
  locations.push({
    "city": location.results[0].address_components[0].long_name,
    "latitude": location.results[0].geometry.location.lat, 
    "longitude": location.results[0].geometry.location.lng
  });
  
  // console.log(location.results[0].geometry.location.lat + ',' + location.results[0].geometry.location.lng);
}


var currentCount = 0;
var currentText = "";

function draw() {
  background(0, 0, 0);
  // rect(0, 0, 360, 180);

  // beginShape();
  fill(50);
  // textSize(7);
  // textFont("Lucida Sans Unicode");
  textFont("Belleza");
  textSize(10);
  // console.log(textWidth(names)/ windowWidth * 4);
  // console.log(windowHeight / (textWidth(names) / windowWidth));
  // text(names, 0, 0, windowWidth, windowHeight);
  
  
  scaleF = windowWidth / 135;
  delayF = 15;
  
  if (pause) {
    currentCount = locationJSON.length;
    pauseCount++;
    
    if (pauseCount == locationJSON.length * delayF) {
      pause = false;
      pauseCount = 0;
    }
    
  } else {
    // currentCount = (frameCount / 15) % locationJSON.length;
    currentCount = (frameCount / delayF) % locationJSON.length;

    if (currentCount + 1 == locationJSON.length) {
      pause = true;
    }
  }
  
  // currentCount = (frameCount / 15) % locationJSON.length;
  
  // currentCount = locationJSON.length;
  
  // Put together the current list of names
  // Could be wrapped in lower loop, but may cause layering issues that need to be sorted
  currentText = "";
  for (var i = 0; i < currentCount; i++) {
    
    if (i == 0) {
      currentText = namesArray[i];
      
    } else {
      currentText = currentText.concat(" · " + namesArray[i]);
      
    }
    
    // currentText = currentText.concat(namesArray[i] + " · ");
  }
  text(currentText.toUpperCase(), 0, 0, windowWidth, windowHeight);
  
  // console.log(currentCount);
  
  for (var i = 0; i < currentCount; i++) {

  // for (var i = 0; i < locationJSON.length; i++) {

    // Need 2 conceptual translations:
    // 1) Compensate for US lat/lon values grouping in quadrant 2
    // 2) Translate compensated values to center of the window
    
    // Translate the body lat/lon values to the zero point (shifting by 40/90 feels visually weighted)
    var adjustedLat = ((locationJSON[i].latitude * scaleF) - 40 * scaleF) * -1;
    var adjustedLon = ((locationJSON[i].longitude * scaleF) + 95 * scaleF);
    
    // Translate lat/lon values to the center of the window
    adjustedLat = adjustedLat + windowHeight/2;
    adjustedLon = adjustedLon + windowWidth/2;
  
    var r = random(100, 255);

    fill(r, r, r, 140);
    noStroke();
    ellipse(adjustedLon, adjustedLat, 2, 2);
    // vertex(adjustedLon, adjustedLat);
  }
  // fill(255);
  // endShape(CLOSE);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  
  if (keyCode === '') {
    console.log(locations.length);
  }
  
  if (keyCode === 83) {
    save('canvas.png')
    console.log("save");
  }
  
  if (keyCode === ENTER) {

    // Go through and add back in all the other information
    for (var i = 0; i < locations.length; i++) {
      locations[i].name = table.getString(i, 1);
      locations[i].date = table.getString(i, 2);
    }
    
    console.log(locations);
    
    // Save it to a JSON file, which doesn't work in the editor for some dumb reason (open in browser)
    saveJSON(locations, 'locations.json');
  }
  
  if (keyCode === 32) {
    console.log(locationJSON);
  }
}