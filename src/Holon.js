class Holon {
    constructor(pos, h) {
        this.initialWidthMax = 0.001
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

    assignGenes() {
        // Hue, Saturdation, Brightness.
        for (var i = 0; i < 3; i++) {
            this.genes[i] = random(0, 1); 
        }

        // Width
        this.genes[3] = random(0, this.initialWidthMax); 
    }

    getWidthFromGenes() {
        return map(this.genes[3], 0, 1, 0, width); 
    }

    createColorFromGenes() {
        var hue = map(this.genes[0], 0, 1, 0, 255); 
        var saturation = map(this.genes[1], 0, 1, 0, 255); 
        var brightness = map(this.genes[2], 0, 1, 0, 255); 
        return color(hue, saturation, brightness); 
    }

    updateSize() {
        this.size.x = this.getWidthFromGenes();
    }
};