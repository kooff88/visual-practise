import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Control: React.FC<{}> = (props) => {
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

    // const fragment = `
    //   #ifdef GL_ES
    //   precision mediump float;
    //   #endif

    //   varying vec2 vUv;

    //   void main(){
    //     vec2 st = vUv * 10.0;
    //     vec2 idx = floor(st);
    //     vec2 grid = fract(st);

    //     vec2 t = mod(idx, 2.0);

    //     if (t.x == 1.0) {
    //       grid.x = 1.0 - grid.x;
    //     }

    //     if (t.y == 1.0) {
    //       grid.y = 1.0 - grid.y;
    //     }

    //     gl_FragColor.rgb = vec3(grid,0.0);
    //     gl_FragColor.a = 1.0;
    //   }

    // `;

    // // 双线
    // const fragment = `

    // #ifdef GL_ES
    // precision highp float;
    // #endif

    // varying vec2 vUv;

    // void main() {
    //   vec3 line = vec3(1, 1, 0);
    //   float d = abs(cross(vec3(vUv,0), normalize(line)).z);
    //   gl_FragColor.rgb = (smoothstep(0.195, 0.2, d) - smoothstep(0.2, 0.205, d)) * vec3(1.0);
    //   gl_FragColor.a = 1.0;
    // }
    // `;

    // // 多平行四边形
    // const fragment = `
    // #ifdef GL_ES
    // precision highp float;
    // #endif

    // varying vec2 vUv;

    // void main() {
    //   vec3 line = vec3(1, 1, 0);
    //   float d = abs(cross(vec3(vUv,0), normalize(line)).z);
    //   d = fract(20.0 * d);
    //   gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    //   gl_FragColor.a = 1.0;
    // }
    // `;

    // 同心圆
    const fragment = `
    
    #ifdef GL_ES
    precision highp float;
    #endif

    varying vec2 vUv;

    void main() {
      float d = distance(vUv, vec2(0.5));
      d = fract(20.0 * d);
      gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
      gl_FragColor.a = 1.0;
    }

    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);
    // renderer.uniforms.uTime = 0.0;
    renderer.uniforms.uMouse = [-1, -1];
    renderer.uniforms.uOrigin = [0.5, 0.5];

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

    // requestAnimationFrame(function update(t) {
    //   renderer.uniforms.uTime = (4 * t) / 1000;
    //   requestAnimationFrame(update);
    // });
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={800} height={800} />
    </div>
  );
};

export default Control;
