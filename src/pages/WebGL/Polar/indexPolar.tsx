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
      uniform float u_k;
      uniform float u_scale;
      uniform float u_offset;

      vec2 polar(vec2 st) {
        return vec2(length(st), atan(st.y, st.x));
      }

      // 圆形
      // void main() {
      //   vec2 st = vUv - vec2(0.5);
      //   st = polar(st);
      //   gl_FragColor.rgb = smoothstep(st.x, st.x + 0.01, 0.2) * vec3(1.0);
      //   gl_FragColor.a = 1.0;
      // }

      // 玫瑰线
      // void main() {
      //   vec2 st = vUv - vec2(0.5);
      //   st = polar(st);
      //   // float d = 0.5 * cos(st.y * 3.0) - st.x;
      //   // float d = 0.5 * cos(st.y * u_k) - st.x; // 动态的、
      //   // float d = 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x;
      //   float d = u_scale * 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x + u_offset;
      //   gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
      //   gl_FragColor.a = 1.0;
      // }

      // 圆形渐变
      void main() {
        vec2 st = vUv - vec2(0.5);
        st = polar(st);
        float d = smoothstep(st.x, st.x + 0.01, 0.2);
        // 将角度范围转换到0到2pi之间
        if(st.y < 0.0) st.y += 6.28;
        // 计算p的值，也就是相对角度，p取值0到1
        float p = st.y / 6.28;
        if(p < 0.45) {
          // p取0到0.45时从红色线性过渡到绿色
          gl_FragColor.rgb = d * mix(vec3(1.0, 0, 0), vec3(0, 0.5, 0), p /  0.45);
        } else {
          // p超过0.45从绿色过渡到蓝色
          gl_FragColor.rgb = d * mix(vec3(0, 0.5, 0), vec3(0, 0, 1.0), (p - 0.45) / (1.0 - 0.45));
        }
        gl_FragColor.a = 1.0;
      }

      `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);
    // renderer.uniforms.uTime = 0.0;

    // renderer.uniforms.u_k = 3; // 花瓣
    renderer.uniforms.u_k = 1.7;
    renderer.uniforms.u_scale = 0.5;
    renderer.uniforms.u_offset = 0.2;

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

    // setInterval(() => {
    //   renderer.uniforms.u_k += 2;
    // }, 200);

    // requestAnimationFrame(function update(t) {
    //   renderer.uniforms.uTime = (4 * t) / 1000;
    //   requestAnimationFrame(update);
    // });

    // function update(t) {
    //   renderer.uniforms.uTime = t / 1000;
    //   requestAnimationFrame(update);
    // }

    // update(0);
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={600} height={600} />
      <div className={styles.conic}></div>
    </div>
  );
};

export default Polar;
