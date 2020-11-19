import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Spots: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    const vertex = `
      attribute vec2 a_vertexPosition;
      uniform vec2 uResolution;
  
      void main() {
        gl_PointSize = 0.2 * uResolution.x;
        gl_Position = vec4(a_vertexPosition, 1, 1);
      }
    `;

    const fragment = `
      #ifdef GL_ES
      precision highp float;
      #endif
      
      void main() {
        gl_FragColor = vec4(0, 0, 1, 1);
      }
    `;
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    renderer.uniforms.uResolution = [canvas.width, canvas.height];
    renderer.setMeshData({
      mode: renderer.gl.POINTS,
      positions: [[0, 0]],
    });

    renderer.render();
  };   

  return (
    <div className={styles.main}>
      <canvas width="600" height="600"></canvas>
    </div>
  );
};

export default Spots;
