export default function sketch(p) {
  function getSphericalCoords(x, y, z) {
    let r = p.sqrt(x * x + y * y + z * z);
    let theta = p.atan2(y, x);
    let phi = p.acos(z);

    return { theta, phi, r };
  }

  function getCartesianCoords(theta, phi, r) {
    let x = r * p.cos(theta) * p.sin(phi);
    let y = r * p.sin(theta) * p.sin(phi);
    let z = r * p.cos(phi);
    return { x, y, z };
  }

  function sampleSpherical(npoints) {
    const vec = [];

    function samplePoint() {
      let x = p.randomGaussian();
      let y = p.randomGaussian();
      let z = p.randomGaussian();
      if (z < 0) {
        z = -z;
      }
      const r = p.sqrt(x * x + y * y + z * z);

      x /= r;
      y /= r;
      z /= r;

      return { x, y, z };
    }

    for (let i = 0; i < npoints; i++) {
      const point = samplePoint();
      vec.push(point);
    }

    return vec;
  }

  const points_unit_sphere = sampleSpherical(2_000);

  const canvasSize = 500;

  const R1 = 100;
  const R2 = 100;

  let noise_min = 1;
  let noise_max = 0;

  const points_1 = [];
  for (let i = 0; i < points_unit_sphere.length; i++) {
    let { x, y, z } = points_unit_sphere[i];

    const scale = R1;
    let screenX = canvasSize / 2 + x * scale;
    let screenY = canvasSize / 2 + y * scale;
    let screenZ = canvasSize / 2 + z * scale;

    points_1.push({ screenX, screenY, screenZ });
  }

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize);
    // p.noLoop();
  };

  p.draw = () => {
    // p.background(220);
    p.background("#F5F5F7");
    // p.background("black")

    const noiseScale = 1;
    const r_noises = [];
    let noise_mean = 0;

    for (let i = 0; i < points_unit_sphere.length; i++) {
      let { x, y, z } = points_unit_sphere[i];

      const speed = 0.02;
      p.noiseDetail(2, 0.25);

      let noise = p.noise(
        noiseScale * 0.3 + x * noiseScale + p.frameCount * speed,
        noiseScale * 0.5 + y * noiseScale + p.frameCount * speed,
        z * noiseScale + p.frameCount * speed
      );

      noise = Math.pow(noise, 4);

      r_noises.push(noise);

      if (noise < noise_min) {
        noise_min = noise;
      }

      if (noise > noise_max) {
        noise_max = noise;
      }

      noise_mean += noise;
    }

    noise_mean /= points_unit_sphere.length;

    // console.log(noise_min, noise_max);

    const points_2 = [];
    for (let i = 0; i < points_unit_sphere.length; i++) {
      let { x, y, z } = points_unit_sphere[i];
      let { theta, phi, r } = getSphericalCoords(x, y, z);

      const r_noise = p.map(r_noises[i], noise_min, noise_max, 0, 1);
      const r_new = r + r_noise;

      const point_new = getCartesianCoords(theta, phi, r_new);

      const scale = R2;
      let screenX = canvasSize / 2 + point_new.x * scale;
      let screenY = canvasSize / 2 + point_new.y * scale;
      let screenZ = canvasSize / 2 + point_new.z * scale;

      points_2.push({ screenX, screenY, screenZ });
    }

    // p.noStroke();
    // let coreColor = p.color("#D0B8A8");
    // coreColor = p.lerpColor(
    //   p.color("#FFF1DB"),
    //   coreColor,
    //   (noise_mean - noise_min) / (noise_max - noise_min)
    // );
    // p.fill(coreColor);
    // p.circle(p.width / 2, p.height / 2, 100 * 2);

    {
      let c = p.color("white");
      c.setAlpha(230);
      p.fill(c);
      p.noStroke();
      for (let i = 0; i < points_1.length; i++) {
        p.circle(points_1[i].screenX, points_1[i].screenY, 5);
      }
    }

    // strokeColor.setAlpha(0);
    for (let i = 0; i < points_1.length; i++) {
      const noise = r_noises[i];
      const noise_ptp = noise_max - noise_min;
      const noise_norm = (noise - noise_min) / noise_ptp;
      const noise_thresh = 0.3;
      if (noise_norm > noise_thresh) {
        continue;
      }

      let color = p.color("#6A9AB0");
      let redColor = p.color("#640D5F");
      color = p.lerpColor(redColor, color, noise_norm / noise_thresh);
      color.setAlpha(50);
      p.stroke(color);

      p.line(
        points_1[i].screenX,
        points_1[i].screenY,
        points_2[i].screenX,
        points_2[i].screenY
      );
    }

    for (let i = 0; i < points_2.length; i++) {
      const noise = r_noises[i];
      const noise_ptp = noise_max - noise_min;
      const noise_norm = (noise - noise_min) / noise_ptp;
      const noise_thresh = 0.4;

      let color = p.color("#6A9AB0");
      color.setAlpha(200);
      // Blend color with red based on noise_norm

      if (noise_norm < noise_thresh) {
        let redColor = p.color("#640D5F"); // Pure red
        color = p.lerpColor(redColor, color, noise_norm / noise_thresh);
      }

      p.fill(color);
      p.noStroke();

      p.circle(points_2[i].screenX, points_2[i].screenY, 5);
    }

    // Create black outline for the whole sketch
    p.noFill();
    p.stroke(0); // Set stroke color to black
    p.strokeWeight(2); // Set stroke weight to 2 pixels
    p.rect(0, 0, p.width, p.height);

    // Apply random noise to every pixel's color
    p.loadPixels();
    for (let i = 0; i < p.pixels.length; i += 4) {

      // Check if the pixel has the background color
      let r = p.pixels[i];
      let g = p.pixels[i + 1];
      let b = p.pixels[i + 2];
      let a = p.pixels[i + 3];
      
      // Assuming the background color is white (255, 255, 255)
      // You may need to adjust this if your background color is different
      if (r === 245 && g === 245 && b === 247 && a === 255) {
        continue;
      }

      let noise = p.random(-50, 50);
      p.pixels[i] = p.constrain(p.pixels[i] + noise, 0, 255);     // Red
      p.pixels[i + 1] = p.constrain(p.pixels[i + 1] + noise, 0, 255); // Green
      p.pixels[i + 2] = p.constrain(p.pixels[i + 2] + noise, 0, 255); // Blue
      // Alpha channel (i + 3) is left unchanged
    }
    p.updatePixels();

  };
}
