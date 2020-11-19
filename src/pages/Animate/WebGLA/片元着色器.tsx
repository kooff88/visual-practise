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
    uniform float rotation;
    float random (vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))*
            43758.5453123);
    }
    vec3 hsb2rgb(vec3 c){
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
      rgb = rgb * rgb * (3.0 - 2.0 * rgb);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }
    void main() {
      vec2 f_uv = fract(vUv * 10.0);
      vec2 i_uv = floor(vUv * 10.0);
      vec2 st = 2.0 * (f_uv - vec2(0.5));
      float c = 0.7 * cos(rotation);
      float s = 0.7 * sin(rotation);
      mat3 transformMatrix = mat3(
        c, s, 0,
        -s, c, 0,
        0, 0, 1
      );
      vec3 pos = transformMatrix * vec3(st, 1.0);
      float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x));
      float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y));
      gl_FragColor = d1 * d2 * vec4(hsb2rgb(vec3(random(i_uv), 1.0, 1.0)), 1.0);
    }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    // const program = renderer.compileSync(fragment, vertex);
    // renderer.useProgram(program);

    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);
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
