var population; 
var rowHeight = 20; 
var generation = 0; 

// ------------------------------- Sketch Setup ------------------------------
function setup() {
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
  // Mating pool & Assign Fitness
  population.selection();

  // Crossover & Mutation
  population.reproduction(); 

  // Keep track of total mutation generations
  generation++;  

  // print(frameCount);
}