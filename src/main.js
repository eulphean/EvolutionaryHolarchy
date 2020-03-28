var population; 
var rowHeight = 20;  

// ------------------------------- Sketch Setup ------------------------------
function setup() {
  frameRate(15);
  createCanvas(windowWidth, windowHeight); 
  population = new Population(rowHeight); 
}

// ------------------------------- Sketch Draw (loop) ------------------------
function draw() {
  population.draw(); 
  // Remap yPos to the top of the canvas. 
  if (population.runningYPos >= height) {
    population.runningYPos = 0;
  }
  population.evaluateStateChange(); 

  // Mating pool & Assign Fitness
  population.selection();

  // Crossover & Mutation
  population.reproduction(); 
}

function keyPressed() {
  draw(); 
}