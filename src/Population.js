// A cell is a spot in the farm that can be planted with a transaction. 
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
        this.mutationProbability = 0.001; 

        this.createInitialPopulation();
    }

    draw() {
        for (var i = 0; i < this.holons.length; i++) {
            this.holons[i].draw(); 
        }
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

    selection() {
        print ("start selection"); 
        this.assignFitness();
        this.createMatingPool(); 
        print("end selection"); 
    }
   
    reproduction() {
        print ("start reproduction"); 
        // Clear the original array. 
        this.holons.length = 0;
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

        print ("end reproduction"); 
    }

    assignFitness() {
        var factor = (this.maxHolonWidth - this.minHolonWidth) / this.numFitnessDivisions; 
        var extent1 = this.minHolonWidth + factor; 
        var extent2 = extent1 + factor; 
        var extent3 = extent2 + factor; 
        for (var h of this.holons) {
            if (h.size.x > this.minHolonWidth && h.size.x < extent1) {
                h.fitness = 0; 
            } else if (h.size.x > extent1 && h.size.x < extent2) {
                h.fitness = 1; // 20%
            } else if (h.size.x > extent2 && h.size.x < extent3) {
                h.fitness = 2; // 30% 
            } else {
                h.fitness = 3; // 50%
            }
        }
    }

    createMatingPool() {
        for (var h of this.holons) {
            if (h.fitness === 1) {
                if (random(1) < 0.2) { // 20% chance. 
                    this.matingPool.push(h);
                }
            } else if (h.fitness === 2) {
                if (random(1) < 0.3) { // 30% chance. 
                    this.matingPool.push(h);
                }
            } else if (h.fitness === 3) {
                if (random(1) < 0.5) { // 50% chance. 
                    this.matingPool.push(h); 
                }
            }
        }
    }

    crossover(holonA, holonB, newPos) {
        var newGenes=[]; 
        for (var i = 0; i < holonA.genes.length; i++) {
            if (random(1) < this.crossoverProbability) {
                newGenes[i] = holonA.genes[i];
            } else {
                newGenes[i] = holonB.genes[i]; 
            }
        }

        // Prepare new holon and copy the genes. 
        var holon = new Holon(newPos, this.rowHeight); 
        for (var i = 0; i < holon.genes.length; i++) {
            holon.genes[i] = newGenes[i]; 
        }

        return holon; 
    }

    mutate(holon) {
        if (random(1) < this.mutationProbability) {
            var len = holon.genes.length;
            for (var i = 0; i < len-1; i++) {
                holon.genes[i] = random(1);
            }

            // Mutate width seperately. 
            // TODO: Complete aesthetic decision here. 
            var num = map(frameCount, 0, Math.pow(2, 13), 0, 1);
            holon.genes[len-1] = num
        }
    }

    getRandomMatingHolon() {
        var randIdx = floor(random(this.matingPool.length));
        return this.matingPool[randIdx]; 
    }
}; 