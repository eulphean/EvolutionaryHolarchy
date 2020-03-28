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
        
        this.crossoverProbability = 0.7;
        this.mutationProbability = 0.3; 

        this.upState = true;
        // Keep track of the generation of the system. 
        this.generation = 0;
        this.numOccurrences = 0; 

        this.createInitialPopulation();
        this.createEvolutionTargets(); 
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
        var min, max;

        for (var i = 0; i < 3; i++) {
            this.targetGenes.push(random(0, 1));
        }

        // Based on the current state, set max and min. 
        if (this.upState == true) {
            min = 0.5; max = 0.95; 
        } else {
            min = 0.0001; max = 0.001; 
        }

        this.targetGenes.push(random(min, max));

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
        
        var arr = []; 
        // Assign fitness
        for (var h of this.holons) {
            var currentColorVector = createVector(h.genes[0], h.genes[1], h.genes[2]);
            var colorMag = p5.Vector.mag(p5.Vector.sub(targetColorVector, currentColorVector));
            var widthMag = Math.abs(this.targetGenes[2] - h.genes[2]); 
            h.fitness = 1/(colorMag + widthMag); 
            arr.push(colorMag + widthMag); 
        }

        var minFitness = Math.min(...arr); 
        if (minFitness <= 0.005) {
            this.numOccurrences++; 
            print('generation, minSum: ' + this.generation + ', ' + minFitness);
        }
    }

    createMatingPool() {
        this.matingPool = []; 

        // Sort holons first. 
        var sortedHolons = _.sortBy(this.holons, ['fitness']); 
        // Put reduction in a variable. 
        var ratio = map (this.generation, 0, pow(2, 20), 0, 0.90, true); // Reduction based on generation passed. 
        var reduction = ratio * sortedHolons.length; 
        // Apply the reduction. 
        this.matingPool = sortedHolons.slice(reduction, sortedHolons.length);
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
                var newVal = map(this.generation, 0, Math.pow(2,12), min, max, true); 
                holon.genes[i] = newVal; 
            }
        }
    }

    getRandomMatingHolon() {
        var randIdx = floor(random(this.matingPool.length));
        return this.matingPool[randIdx]; 
    }

    evaluateStateChange() {
        var maxOccurrences = this.upState ? 5 : 10; // Up State is when size is increasing. Down State is when size is decreasing. 
        if (this.numOccurrences >=maxOccurrences) {
            print('Reached target. Reset now.')
            this.generation = 0; 
            this.numOccurrences = 0; 
            this.upState = !this.upState; // Change the state.
            this.createEvolutionTargets(); 
            this.crossoverProbability = random(0.7, 1); 
            this.mutationProbability = random(0.1, 0.5);
        }
    }
}; 