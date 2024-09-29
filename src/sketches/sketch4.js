export default function sketch(p) {
    const points = [
        { x: 100, y: 200 },
        { x: 200, y: 100 },
        { x: 300, y: 200 },
        { x: 300, y: 300 },
        { x: 200, y: 400 },
        { x: 100, y: 300 }
    ];

    p.setup = () => {
        p.createCanvas(400, 400, p.WEBGL);
        p.describe('A silhouette of a rotating torus colored with a gradient from cyan to purple.');
    };
    p.draw = () => {
        p.background(200);

        // Create a mask.
        p.beginClip();
        p.push();
        p.rotateX(p.frameCount * 0.01);
        p.rotateY(p.frameCount * 0.01);
        p.scale(0.5);
        p.torus(30, 15);
        p.pop();
        p.endClip();

        // Draw a backing shape.
        p.noStroke();
        p.beginShape(p.QUAD_STRIP);
        p.fill(0, 255, 255);
        p.vertex(-p.width / 2, -p.height / 2);
        p.vertex(p.width / 2, -p.height / 2);
        p.fill(100, 0, 100);
        p.vertex(-p.width / 2, p.height / 2);
        p.vertex(p.width / 2, p.height / 2);
        p.endShape();
    };
}