import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Wrapper = ({ sketch }) => {
  const sketchRef = useRef();

  useEffect(() => {
    let instance = new p5(sketch, sketchRef.current);

    return () => {
      instance.remove();
    };
  }, [sketch]);

  return <div ref={sketchRef}></div>;
};

export default P5Wrapper;