export default function sketch(p) {
    p.setup = () => {
        p.createCanvas(400, 400);
        p.noiseDetail(4, 0.5); // Adjust noise detail for more natural look
        p.noLoop();
    };

    function getMountainColor(lightness) {
        const baseColor = p.color("#001F3F"); // Dark indigo
        return p.lerpColor(baseColor, p.color(255, 255, 255), lightness);
    }

    function drawMountain(x1, y1, peakX, peakY, x2, y2, lightness) {
        p.fill(getMountainColor(lightness));
        p.beginShape();
        drawNoisyCurve(x1, y1, peakX, peakY);
        drawNoisyCurve(peakX, peakY, x2, y2);
        p.vertex(x2, y2);
        p.vertex(x1, y1);
        p.endShape();

        // Draw transparent white triangle on top of the mountain
        p.push();
        p.stroke(255);  // Set stroke color to white
        p.strokeWeight(4);  // Set stroke weight
        p.drawingContext.setLineDash([10, 10]);  // Set dashed line pattern
        p.fill(p.color(p.random(360), 100, 100, 50)); // Random hue with 50 (out of 255) alpha
        p.triangle(x1, y1, peakX, peakY, x2, y2);
        p.pop();

        // Spray white filled circles on top of the mountain
        // p.push();
        // p.noStroke();
        // const numCircles = 200;
        // for (let i = 0; i < numCircles; i++) {
        //     let circleX = p.random(x1, x2);
        //     let circleY = p.random(y1, peakY); // p.map(circleX, x1, x2, y1, y2);
        //     // circleY = p.min(circleY, p.map(circleX, x1, x2, y1, peakY, x2, y2));
        //     let size = p.map(circleY, y1, peakY, 0, 1, true);
        //     size *= p.random(8, 10);
        //     p.fill(255, 255, 255, p.random(0, 255)); // White with some transparency
        //     p.ellipse(circleX, circleY, size, size);
        // }
        // p.pop();
    }

    function drawNoisyCurve(x1, y1, x2, y2) {
        const steps = 100;
        // p.beginShape();
        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            let x = p.lerp(x1, x2, t);
            let y = p.lerp(y1, y2, t);
            let noiseFactor =-p.noise(x * 0.05, y * 0.05) * 30;
            p.curveVertex(x, y + noiseFactor);
        }
        // p.endShape();
    }

    p.draw = () => {

        p.background("white");

        const horizon = 350 ;

        // Gradient sky
        // for (let y = 0; y < horizon; y++) {
        //     let inter = p.map(y, 0, horizon / 2, 0, 1, true);
        //     let c = p.lerpColor(p.color(70, 130, 180), p.color(245, 245, 220), inter);
        //     p.stroke(c);
        //     p.line(0, y, p.width, y);
        // }

        // Function to draw noisy curve between two points


        // Function to calculate fill color based on y-coordinate


        // Draw 3 noisy mountains with smooth peaks and atmospheric dispersion
        p.stroke("black");
        p.strokeWeight(2);

        // First mountain
        // Function to draw a mountain


        // Draw the first mountain
        drawMountain(0, horizon, 100, 200, 400, horizon, 0.7);

        // Second mountain
        drawMountain(50, horizon, 300, 100, 550, horizon, 0.3);

        // Third mountain
        drawMountain(-190, horizon, -40, 50, 110, horizon, 0.1);

        // Draw white rectangle below the horizon
        // p.noStroke();
        p.stroke("black");
        p.strokeWeight(2);
        p.fill(255);
        p.rect(0, horizon - 30, p.width, p.height);

        // Create black outline for the whole sketch
        p.push(); // Save current drawing state
        p.noFill();
        p.stroke(0);
        
        p.strokeWeight(2);
        p.rect(0, 0, p.width, p.height);
        p.pop(); // Restore previous drawing state
    };

    p.mousePressed = () => {
        p.redraw();
    };
}