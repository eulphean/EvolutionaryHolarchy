class Holon {
    constructor(pos, h) {
        // Width is evolving with time. 
        this.maxInitialWidth = 0.01;
        this.maxInitialColor = 0.1; 

        // R, G, B, W (Red, Green, Blue, Width) are the genotypes. 
        this.genes = []; 
        this.fitness = 0; 
        this.assignGenes(); 
        this.position = createVector(pos.x, pos.y);
        this.size = createVector(this.getWidthFromGenes(), h);
    }

    draw() {
        var c = this.createColorFromGenes();  
        push();
            translate(this.position); 
            fill(c); 
            noStroke();
            rect(0, 0, this.size.x, this.size.y);
        pop(); 
    }

    updateSize() {
        this.size.x = this.getWidthFromGenes();
    }

    assignGenes() {
        // Red, Green, Blue. 
        for (var i = 0; i < 3; i++) {
            this.genes[i] = random(0, 1); 
        }

        // Width (create a small width to start with)
        this.genes[3] = random(0, this.maxInitialWidth); 
    }

    getWidthFromGenes() {
        return map(this.genes[3], 0, 1, 0, width); 
    }

    createColorFromGenes() {
        var red = map(this.genes[0], 0, 1, 0, 255); 
        var green = map(this.genes[1], 0, 1, 0, 255); 
        var blue = map(this.genes[2], 0, 1, 0, 255); 
        return color(red, green, blue); 
    }
};