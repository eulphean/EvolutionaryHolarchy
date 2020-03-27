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

    createEvolutionTargets() {
        // Determines the direction of evolution. 
        this.targetGenes = []; 
        // Target colors. 
        for (var i = 0; i < 3; i++) {
            this.targetGenes.push(random(0.8, 1)); // 80-100% just to see how it works. 
        }

        this.targetGenes[0] = 1; this.targetGenes[1] = 1; this.targetGenes[2] = 1; 
        // Set target width
        this.targetGenes.push(random(0.5, 1)); // 80-100% just to see how it works. 

        print ("Target Gene is " + this.targetGenes);
    }

    selection() {
        print ("start selection"); 
        this.assignFitness();
        this.createMatingPool(); 
        print("end selection"); 
    }
   
    reproduction() {
         print ("start reproduction"); 
        // Clear original holons.  
        if (this.matingPool.length === 0) {
            this.matingPool = this.holons;
        }
        this.holons = []; 
        while (this.runningXPos < width) {
            var pos = createVector(this.runningXPos, this.runningYPos); 
            var holonA = this.getRandomMatingHolon();
            print('HolonA: ' + holonA); print('HolonB: ' + holonB);
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
        var targetColorVector = createVector(this.targetGenes[0], this.targetGenes[1], this.targetGenes[2]); 
        var totalFitness = 0; 
        // Set fitness. 
        for (var h of this.holons) {
            var currentColorVector = createVector(h.genes[0], h.genes[1], h.genes[2]);
            var colorMag = p5.Vector.mag(p5.Vector.sub(targetColorVector, currentColorVector));
            var widthMag = Math.abs(this.targetGenes[2] - h.genes[2]); 
            h.fitness = colorMag + widthMag; 
            totalFitness += h.fitness; 
        }

        // Normalize fitness (now all holons have a fitness between 0-1)
        // We will use these fitnesses as probabilities to select Holons
        // for the next evolution iteration. 
        for (var h of this.holons) {
            var normal = h.fitness / totalFitness; 
            h.fitness = normal; // I can square this number to get a better probability 
        }
    }

    createMatingPool() {
        this.matingPool = []; 
        for (var h of this.holons) {
            if (random(1) <= h.fitness) {
                this.matingPool.push(h); 
            }
        }
    }

    crossover(holonA, holonB, newPos) {
        var newGenes=[]; 
        var genesA = holonA.genes; var genesB = holonB.genes; 
        for (var i = 0; i < holonA.genes.length; i++) {
          if (random(1) < this.crossoverProbability) {
              newGenes[i] = genesA[i] >= genesB[i] ? genesA[i] : genesB[i];
          } else {
              newGenes[i] = random(1) < 0.5 ? genesA[i] : genesB[i];  
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
                var a = map(frameCount, 0, Math.pow(2, 12), holon.genes[i], this.targetGenes[i]); 
                holon.genes[i] = a;
            }

            var num = map(frameCount, 0, Math.pow(2, 12), holon.genes[3], this.targetGenes[3]);
            holon.genes[len-1] = num
        }
    }

    getRandomMatingHolon() {
        var randIdx = floor(random(this.matingPool.length));
        return this.matingPool[randIdx]; 
    }
}; 