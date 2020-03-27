class Population {
    constructor(rHeight) {
        this.holons = []; 
        this.matingPool = [];  
        this.rowHeight = rHeight; 

        this.runningYPos = 0; 
        this.runningXPos = 0; 

        // Maintain these while creating holons. 
        this.maxHolonWidth = 9999; 
        this.minHolonWidth = -9999; 

        // Keep track of all the holon widths that are created. 
        this.holonWidths = []; 
        this.numFitnessDivisions = 4; 
        
        this.crossoverProbability = 0.3;
        this.mutationProbability = 0.1; 

        this.createInitialPopulation();
        this.createEvolutionTargets();

        this.generation = 0; 
    }

    draw() {
        for (var i = 0; i < this.holons.length; i++) {
            this.holons[i].draw(); 
        }
        this.generation++; 
    }

    createInitialPopulation() {
        while (this.runningXPos < width) {
            var pos = createVector(this.runningXPos, this.runningYPos); 
            var holon = new Holon(pos, this.rowHeight); 
            this.runningXPos += holon.size.x; 
            this.holons.push(holon);
            // Track all widths. 
            this.holonWidths.push(holon.size.x); 
        }

        // Filter min and max width. 
        this.maxHolonWidth = Math.max(...this.holonWidths); 
        this.minHolonWidth = Math.min(...this.holonWidths); 
       
        // Update x and y. 
        this.runningXPos = 0; 
        this.runningYPos += this.rowHeight; 
        print("Created initial Holon population: " + this.holons.length); 
        print("Max Width, Min Width: " + this.maxHolonWidth + ", " + this.minHolonWidth); 
    }

    createEvolutionTargets() {
        // Determines the direction of evolution. 
        this.targetGenes = []; 
        // Target colors. 
        for (var i = 0; i < 3; i++) {
            this.targetGenes.push(0); // 80-100% just to see how it works. 
        }

        // Set target width
        this.targetGenes.push(random(0.5, 0.6)); // 80-100% just to see how it works. 

        print ("Target Gene is " + this.targetGenes);
    }

    selection() {
        // print ("start selection"); 
        this.assignFitness();
        this.createMatingPool(); 
        // print("end selection"); 
    }
   
    reproduction() {
        //  print ("start reproduction"); 
        // Clear original holons.  
        if (this.matingPool.length === 0) {
            this.matingPool = this.holons;
        }
        this.holons = []; 
        while (this.runningXPos < width) {
            var pos = createVector(this.runningXPos, this.runningYPos); 
            var holonA = this.getRandomMatingHolon();
            var holonB = this.getRandomMatingHolon();
            // print (holonA); print (holonB); 
            var newHolon = this.crossover(holonA, holonB, pos); 
            this.mutate(newHolon); 
            // Update width based on the previous steps. 
            newHolon.updateSize(); 
            this.holons.push(newHolon); 
            this.runningXPos += newHolon.size.x; 
        }

        this.runningYPos += this.rowHeight;
        this.runningXPos = 0; 

        // print ("end reproduction"); 
    }

    assignFitness() {
        var targetColorVector = createVector(this.targetGenes[0], this.targetGenes[1], this.targetGenes[2]); 
        // Set fitness. 
        var totalFitness = 0; var fi
        for (var h of this.holons) {
            var currentColorVector = createVector(h.genes[0], h.genes[1], h.genes[2]);
            var colorMag = p5.Vector.mag(p5.Vector.sub(targetColorVector, currentColorVector));
            var widthMag = Math.abs(this.targetGenes[2] - h.genes[2]); 
            h.fitness = Math.pow(2, 1/(colorMag + widthMag)); 
            totalFitness += h.fitness
        }

        //print ('Total Fitness: ' + totalFitness); 
        for (var h of this.holons) {
            h.fitness = h.fitness/ totalFitness;
            //print (h.fitness);
        }
    }

    createMatingPool() {
        this.matingPool = []; 
        // for (var h of this.holons) {
        //     var v = random(1); 
        //     if (v <= h.fitness) {
        //         print ('Random, Fitness: ' + v + ', ' + h.fitness);
        //         this.matingPool.push(h); 
        //     }
        // }

        print ('Mating Pool Size: ' + this.matingPool.length);
    }

    crossover(holonA, holonB, newPos) {
        var holon = new Holon(newPos, this.rowHeight); 
        var newGenes=[]; 
        var genesA = holonA.genes; var genesB = holonB.genes; 
        for (var i = 0; i < genesA.length; i++) {
            if (random(1) < this.crossoverProbability) {
                holon.genes[i] = random(1) < 0.5 ? genesA[i] : genesB[i]; 
            } // Else, just use the random genes from the holon
        }

        return holon; 
    }

    mutate(holon) {
        for (var i = 0; i < holon.genes.length; i++) {
            if (random(1) < this.mutationProbability) {
                if (holon.genes[i] < this.targetGenes[i]) {
                    min = holon.genes[i]; max = this.targetGenes[i];
                } else {
                    min = this.targetGenes[i]; max = holon.genes[i];
                }
                var newVal = map(this.generation, 0, Math.pow(2,15), min, max); 
                holon.genes[i] = newVal; 
            }
        }
    }

    getRandomMatingHolon() {
        var randIdx = floor(random(this.matingPool.length));
        return this.matingPool[randIdx]; 
    }
}; 


// var minFitness = Math.min(...fitnesses); 
// var maxFitness = Math.max(...fitnesses); 
// // print (minFitness + ',' + maxFitness);
// var factor = (maxFitness - minFitness)/4; 
// var extent1 = createVector(minFitness, minFitness+factor); // 10%
// var extent2 = createVector(extent1.y, extent1.y+factor); // 20%
// var extent3 = createVector(extent2.y, extent2.y+factor); // 30%; 
// var extent4 = createVector(extent3.y, maxFitness); 

// //print('Extents');
// // print(extent1 + ',' + extent2 + ',' + extent3 + ',' + extent4);

// // Normalize fitness (now all holons have a fitness between 0-1)
// // We will use these fitnesses as probabilities to select Holons
// // for the next evolution iteration. 
// for (var h of this.holons) {
//     if (h.fitness > extent1.x && h.fitness < extent1.y) {
//         h.fitness = 0.1; 
//     } else if (h.fitness > extent2.x && h.fitness < extent2.y) {
//         h.fitness = 0.2; 
//     } else if (h.fitness > extent3.x && h.fitness < extent3.y) {
//         h.fitness = 0.3; 
//     } else if (h.fitness > extent4.x && h.fitness < extent4.y) {
//         h.fitness = 0.4; 
//     }
// }

    // if (random(1) < this.crossoverProbability) {
        //     for (var i = 0; i < holonA.genes.length; i++) {
        //         // From part -> whole, great genes is applied
        //         newGenes[i] = genesA[i]  genesB[i] ? genesA[i] : genesB[i]; 

        //         // From whole -> part, smaller genes is applied
        //         // TODO: Write a check to see which state am I am in. 
        //     }
        // } else {
        // newGenes = (random(1) < 0.5) ? genesA : genesB; 
        // }

        // if (random(1) < this.mutationProbability) {
        //     var len = holon.genes.length;
        //     var min, max; 
        //     for (var i = 0; i < len; i++) {
        //         if ()
        //         // if (holon.genes[i] < this.targetGenes[i]) {
        //         //     min = holon.genes[i]; max = this.targetGenes[i];
        //         // } else {
        //         //     min = this.targetGenes[i]; ; max = holon.genes[i];
        //         // }
        //         // var newVal = map(frameCount, 0, Math.pow(2, 12), 0, 1); 
        //         var newVal = random(0, 1); 
        //         holon.genes[i] = newVal;
        //     }
        // }