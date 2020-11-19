import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
// import { Renderer, Program, Geometry, Transform, Mesh } from 'ogl';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Performance: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    const vertex = `
      attribute vec2 a_vertexPosition;

      uniform mat3 modelMatrix;

      void main(){
        vec3 pos = modelMatrix * vec3( a_vertexPosition,1 );
        gl_Position = vec4( pos, 1 );        
      }
    `;

    const fragment = `
      #ifdef GL_ES
      precision highp float;
      #endif

      uniform vec4 u_color;

      void main(){
        gl_FragColor = u_color;
      }
    `;

    const program = renderer.compileSync(fragment, vertex)
    renderer.useProgram(program);

    const alpha = 2 * Math.PI / 3;
    const beta = 2 * alpha;


    renderer.setMeshData({
      positions: [
        [0, 0.1],
        [0.1 * Math.sin(alpha), 0.1 * Math.cos(alpha)],
        [0.1 * Math.sin(beta), 0.1 * Math.cos(beta)],
      ],
    });


    const COUNT = 3000;
    function render() {
      for(let i = 0; i < COUNT; i++) {
        const x = 2 * Math.random() - 1;
        const y = 2 * Math.random() - 1;
        const rotation = 2 * Math.PI * Math.random();

        renderer.uniforms.modelMatrix = [
          Math.cos(rotation), -Math.sin(rotation), 0,
          Math.sin(rotation), Math.cos(rotation), 0,
          x, y, 1,
        ];

        renderer.uniforms.u_color = [
          Math.random(),
          Math.random(),
          Math.random(),
          1];

        renderer._draw();
      }
      requestAnimationFrame(render);
    }

    render();
  };

  return (
    <div className={styles.main}>
        <canvas width="600" height="600"></canvas>
    </div>
  );
};

export default Performance;
