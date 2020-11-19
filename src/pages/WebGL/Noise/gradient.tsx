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

        vec2 random2(vec2 st){
        st = vec2( dot(st,vec2(127.1,311.7)),
                    dot(st,vec2(269.5,183.3)) );
        return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
        }

        // Gradient Noise by Inigo Quilez - iq/2013
        // https://www.shadertoy.com/view/XdXGW8
        float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
        }

        void main() {
            vec2 st = vUv * 20.0;
            gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
            gl_FragColor.a = 1.0;
        }
      
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

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
