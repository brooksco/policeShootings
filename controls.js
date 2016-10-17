var video = false;
var videoFrames = 3600;
var videoCount = 0;

function keyPressed() {
  
  if (keyCode === 32) {
    // console.log(locations.length);
    showAll = !showAll;
  }
  
  // Save image
  // s
  if (keyCode === 83) {
    saveCanvas("canvas.png","png");
    // saveCanvas("canvas.jpg","jpg");
    console.log("Saved image");
  }
  
  // Save video frames
  // v
  if (keyCode === 86) {
    if (video) {
      video = false;
      videoCount = 0;
      
      console.log("Video stop");
      
    } else {
      video = true;
      
      console.log("Video start");
      
    }
    
  }
  
  // + font size
  if (keyCode === 187) {
    fontSize += .1;
    console.log("Font size: " + fontSize);
  }
  
  // - font size
  if (keyCode === 189) {
    fontSize -= .1;
    
    if (fontSize < 1) {
      fontSize = .1;
    }
    
    console.log("Font size: " + fontSize);
  }
  
  // + font tone
  if (keyCode === 221) {
    fontTone += 2;
    
    if (fontTone > 255) {
      fontTone = 255;
    }
    
    console.log("Font tone: " + fontTone);
  }
  
  // - font tone
  if (keyCode === 219) {
    fontTone -= 2;
    
    if (fontTone < 1) {
      fontTone = 0;
    }
    
    console.log("Font tone: " + fontTone);
  }
  
  // Save new JSON file
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
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
