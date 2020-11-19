import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import { Animator } from '../common/';
import styles from './index.less';

const WebGLA: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const vertex = `
    attribute vec2 a_vertexPosition;
    attribute vec2 uv;
    varying vec2 vUv;
    uniform float rotation;
    void main() {
      gl_PointSize = 1.0;
      vUv = uv;
      float c = cos(rotation);
      float s = sin(rotation);
      mat3 transformMatrix = mat3(
        c, s, 0,
        -s, c, 0,
        0, 0, 1
      );
      vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
      gl_Position = vec4(pos, 1);
    }
    `;

    const fragment = `
      #ifdef GL_ES
      precision highp float;
      #endif
      varying vec2 vUv;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    // const program = renderer.compileSync(fragment, vertex);
    // renderer.useProgram(program);

    const textureURL = 'https://p.ssl.qhimg.com/t01f265b6b6479fffc4.png';
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);
    renderer.uniforms.color = [1, 0, 0, 1];
    renderer.uniforms.rotation = 0.0;

    const animator = new Animator({ duration: 2000, iterations: Infinity });
    animator.animate(renderer, ({ target, timing }) => {
      target.uniforms.rotation = timing.p * 2 * Math.PI;
    });

    renderer.setMeshData([
      {
        positions: [
          [-0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
          [0.5, -0.5],
        ],
        attributes: {
          uv: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
          ],
        },
        cells: [
          [0, 1, 2],
          [2, 0, 3],
        ],
      },
    ]);
    renderer.render();
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={600} height={600} />
      <div className={styles.conic}></div>
    </div>
  );
};

export default WebGLA;
