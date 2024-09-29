export default function sketch(p) {
    p.setup = () => {
      p.createCanvas(400, 400);
    };
  
    p.draw = () => {
      p.background(220);
      p.fill(255, 192, 203); // Pink color
      p.rectMode(p.CENTER);
      p.rect(p.width / 2, p.height / 2, 100, 100);
    };
  }