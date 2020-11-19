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
      
      uniform sampler2D tMap;
      uniform float uTime;

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

      // void main() {
      //   float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));
      //    d = fract(20.0 * abs(d)); 
      //    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);  // 注释此行则 形成渐变图形
      //    gl_FragColor.a = 1.0;
      // }

      // 三角开幕
      // void main (){
      //   vec4 color = texture2D(tMap, vUv);
      //   vec2 uv = vUv - vec2(0.5);
      //   vec2 a = vec2(-0.577, 0) - vec2(0.5);
      //   vec2 b = vec2(0.5, 1.866) - vec2(0.5);
      //   vec2 c = vec2(1.577, 0) - vec2(0.5);

      //   float scale = min(1.0, 0.00005 * uTime);
      //   float d = triangle_distance(uv, scale * a, scale * b, scale * c);
      //   gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * color.rgb;
      //   gl_FragColor.a = 1.0;

      // }

      // 进度条
      void main() {
        vec4 color = texture2D(tMap, vUv);
        vec2 uv = vUv - vec2(0.5);
        vec2 a = vec2(0, 1);
        float time = 0.002 * uTime;
        vec2 b = vec2(sin(time), cos(time));
        float d = 0.0;
        float c0 = cross(vec3(b, 0.0), vec3(a, 0.0)).z;
        float c1 = cross(vec3(uv, 0.0), vec3(a, 0.0)).z;
        float c2 = cross(vec3(uv, 0.0), vec3(b, 0.0)).z;
        if(c0 > 0.0 && c1 > 0.0 && c2 < 0.0) {
          d = 1.0;
        }
        if(c0 < 0.0 && (c1 >= 0.0 || c2 <= 0.0)) {
          d = 1.0;
        }
        gl_FragColor.rgb = color.rgb;
        gl_FragColor.r *= mix(0.3, 1.0, d);
        gl_FragColor.a = mix(0.9, 1.0, d);
      }
    `;

    const imgURL = 'https://p0.ssl.qhimg.com/t010ef34cd7b52b559f.jpg';

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);
    // renderer.uniforms.uTime = 0.0;
    // renderer.uniforms.uMouse = [-1, -1];
    // renderer.uniforms.uOrigin = [0.5, 0.5];

    (async function () {
      const texture = await renderer.loadTexture(imgURL);
      renderer.uniforms.tMap = texture;

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

      function update(t) {
        renderer.uniforms.uTime = t;
        requestAnimationFrame(update);
      }
      update(2000);
    })();

    // renderer.setMeshData([
    //   {
    //     positions: [
    //       [-1, -1],
    //       [-1, 1],
    //       [1, 1],
    //       [1, -1],
    //     ],
    //     attributes: {
    //       uv: [
    //         [0, 0],
    //         [0, 1],
    //         [1, 1],
    //         [1, 0],
    //       ],
    //     },
    //     cells: [
    //       [0, 1, 2],
    //       [2, 0, 3],
    //     ],
    //   },
    // ]);

    // renderer.render();

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
