var population; 
var rowHeight = 20; 
var generation = 0; 

// ------------------------------- Sketch Setup ------------------------------
function setup() {
  colorMode(HSB); 
  createCanvas(windowWidth, windowHeight); 
  population = new Population(rowHeight); 
}

// ------------------------------- Sketch Draw (loop) ------------------------
function draw() {
  population.draw(); 
  if (population.runningYPos >= height) {
    population.runningYPos = 0;
  }
  population.selection();
  population.reproduction(); 
  generation++;  

  print(frameCount);

  // Have I reached the end? 
  // If yes, stop drawing
  // If no, draw the 
}