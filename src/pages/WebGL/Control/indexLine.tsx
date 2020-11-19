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

    // 绘制圆
    const fragment = `
      #ifdef GL_ES
      precision mediump float;
      #endif

      varying vec2 vUv;
      uniform vec2 uMouse;
      uniform vec2 uOrigin;

      // 点到线段距离
      float seg_distance( in vec2 st, in vec2 a, in vec2 b ) {
        vec3 ab = vec3(b - a, 0); 
        vec3 p = vec3(st - a, 0); 
        float l = length(ab); 
        float d = abs(cross(p, normalize(ab)).z); 
        float proj = dot(p, ab) / l; 
        if(proj >= 0.0 && proj <= l) return d; 
        return min(distance(st, a), distance(st, b));
      }


      // 圆
      // void main(){
      //   float d = distance(vUv, vec2(0.5));
      //   // gl_FragColor.rgb = step(d, 0.2) * vec3(1.0);
      //   gl_FragColor.rgb = smoothstep(d, d + 0.01, 0.2) * vec3(1.0);
      //   gl_FragColor.a = 1.0;
      // }

      // 直线
      void main() {
        // vec3 line = vec3(uMouse - uOrigin, 0); // 用向量表示所在直线
        // float d = abs(cross(vec3(vUv - uOrigin, 0), normalize(line)).z); // 叉乘表示平行四边形面积，底边为1，得到距离
        float d = seg_distance(vUv, uOrigin, uMouse);
        gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
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

    canvas.addEventListener('mousemove', (e) => {
      const { x, y, width, height } = e.target.getBoundingClientRect();
      renderer.uniforms.uMouse = [(e.x - x) / width, 1.0 - (e.y - y) / height];
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
