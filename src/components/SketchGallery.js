import React, { useState } from 'react';
import P5Wrapper from './P5Wrapper';
import sketches from '../sketches';

const SketchGallery = () => {
  const [currentSketch, setCurrentSketch] = useState(null);

  const handleSketchClick = (sketch) => {
    setCurrentSketch(() => sketch);
  };

  return (
    <div>
      <h2>p5.js Sketch Gallery</h2>
      <div>
        {Object.entries(sketches).map(([name, sketch]) => (
          <button key={name} onClick={() => handleSketchClick(sketch)}>
            {name}
          </button>
        ))}
      </div>
      {currentSketch && <P5Wrapper sketch={currentSketch} />}
    </div>
  );
};

export default SketchGallery;