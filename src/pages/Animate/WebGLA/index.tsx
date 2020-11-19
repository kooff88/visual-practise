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
      attribute vec4 color;
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
    highp float random(vec2 co) {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
    }
    // Value Noise by Inigo Quilez - iq/2013
    // https://www.shadertoy.com/view/lsf3WH
    highp float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix( mix( random( i + vec2(0.0,0.0) ),
                        random( i + vec2(1.0,0.0) ), u.x),
                    mix( random( i + vec2(0.0,1.0) ),
                        random( i + vec2(1.0,1.0) ), u.x), u.y);
    }
    float sdf_circle(vec2 st, vec2 c, float r) {
      return 1.0 - length(st - c) / r;
    }
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec2 st = vUv;
      float rx = mix(-0.2, 0.2, noise(vec2(7881.32, 0) + random(st) + uTime));
      float ry = mix(-0.2, 0.2, noise(vec2(0, 1433.59) + random(st) + uTime));
      float dis = distance(st, vec2(0.5));
      dis = pow((1.0 - dis), 2.0);
      float d = sdf_circle(st + vec2(rx, ry), vec2(0.5), 0.2);
      d = smoothstep(0.0, 0.1, d);
      gl_FragColor = vec4(dis * d * vec3(1.0), 1.0);
    }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    renderer.uniforms.uTime = 0;
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

export default WebGLA;
