import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import { parametric } from './parametric';
import styles from './index.less';

const Polar: React.FC<{}> = (props) => {
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
      uniform vec2 uMouse;

      vec3 hsv2rgb(vec3 c){
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        rgb = rgb * rgb * (3.0 - 2.0 * rgb);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      vec2 polar(vec2 st) {
        return vec2(length(st), atan(st.y, st.x));
      }

      void main() {
        vec2 st = vUv - vec2(0.5);
        st = polar(st);
        float d = smoothstep(st.x, st.x + 0.01, 0.2);
        if(st.y < 0.0) st.y += 6.28;
        float p = st.y / 6.28;
        gl_FragColor.rgb = d * hsv2rgb(vec3(p, uMouse.x, uMouse.y));
        gl_FragColor.a = 1.0;
      }

      `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);
    renderer.uniforms.uMouse = [0.5, 0.5];

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
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={600} height={600} />
      <div className={styles.conic}></div>
    </div>
  );
};

export default Polar;
