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

    // 绘制三角
    const fragment = `
      #ifdef GL_ES
      precision mediump float;
      #endif

      varying vec2 vUv;

      float line_distance(in vec2 st, in vec2 a, in vec2 b) {
        vec3 ab = vec3(b - a, 0);
        vec3 p = vec3(st - a, 0);
        float l = length(ab);
        return cross(p, normalize(ab)).z;
      }

      
      float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
        vec3 ab = vec3(b - a, 0);
        vec3 p = vec3(st - a, 0);
        float l = length(ab);
        float d = abs(cross(p, normalize(ab)).z);
        float proj = dot(p, ab) / l;
        if(proj >= 0.0 && proj <= l) return d;
        return min(distance(st, a), distance(st, b));
      }

      float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
        float d1 = line_distance(st, a, b);
        float d2 = line_distance(st, b, c);
        float d3 = line_distance(st, c, a);
        if(d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0) {
          return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负
        }
        
        return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部为正
      }

      void main() {
        float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));
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
