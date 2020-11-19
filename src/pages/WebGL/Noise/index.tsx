import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Noise: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const vertex = `
      attribute vec2 a_vertexPosition;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        gl_PointSize = 1.0;
        vUv = uv;
        gl_Position = vec4(a_vertexPosition, 1, 1);
      }
    `;

    const fragment = `

    #ifdef GL_ES
    precision highp float;
    #endif
    varying vec2 vUv;
    uniform float uTime;
    
    vec2 random2(vec2 st){
      st = vec2( dot(st,vec2(127.1,311.7)),
                dot(st,vec2(269.5,183.3)) );
      return fract(sin(st) * 43758.5453123);
    }
    void main() {
      vec2 st = vUv * 10.0;
      float d = 1.0;
      vec2 i_st = floor(st);
      vec2 f_st = fract(st);
      // vec2 p = random2(i_st);
      // d = distance(f_st, p);
      for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
          vec2 neighbor = vec2(float(i), float(j));
          vec2 p = random2(i_st + neighbor);
          p = 0.5 + 0.5 * sin(uTime + 6.2831 * p);
          d = min(d, distance(f_st, neighbor + p));
        }
      }
      gl_FragColor.rgb = vec3(d) + step(d, 0.03);
      gl_FragColor.a = 1.0;
    }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    renderer.uniforms.uTime = 0.0;

    requestAnimationFrame(function update(t) {
      renderer.uniforms.uTime = 0.001 * t;
      requestAnimationFrame(update);
    });

    renderer.setMeshData([
      {
        positions: [
          [-1, -1],
          [-1, 1],
          [1, 1],
          [1, -1],
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

export default Noise;
