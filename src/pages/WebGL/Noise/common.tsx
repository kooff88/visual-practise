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
    // 随机函数
    // float random (float x) {
    //   return fract(sin(x * 1243758.5453123));
    // }
    
    // 一维噪声
    // void main() {
    //   vec2 st = vUv - vec2(0.5);
    //   st *= 10.0;
    //   float i = floor(st.x);
    //   float f = fract(st.x);
      
    //   // float d = random(i);
    //   // float d = mix(random(i), random(i + 1.0), f);
    //   float d = mix(random(i), random(i + 1.0), smoothstep(0.0, 1.0, f));
    //   // float d = mix(random(i), random(i + 1.0), f * f * (3.0 - 2.0 * f));
      
    //   gl_FragColor.rgb = (smoothstep(st.y - 0.05, st.y, d) - smoothstep(st.y, st.y + 0.05, d)) * vec3(1.0);
    //   gl_FragColor.a = 1.0;
    // }

    
    float random (vec2 st) {
        return fract(sin(dot(st.xy,
                  vec2(12.9898,78.233)))*
          43758.5453123);
    }
    
    // 二维噪声，对st与方形区域的四个顶点插值
    highp float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix( mix( random( i + vec2(0.0,0.0) ),
                        random( i + vec2(1.0,0.0) ), u.x),
                    mix( random( i + vec2(0.0,1.0) ),
                        random( i + vec2(1.0,1.0) ), u.x), u.y);
    }
    
      // void main() {
      //     vec2 st = vUv * 20.0;
      //     gl_FragColor.rgb = vec3(noise(st));
      //     gl_FragColor.a = 1.0;
      // }

      // 效果一      
      // void main() {
      //   vec2 st = mix(vec2(-10, -10), vec2(10, 10), vUv);
      //   float d = distance(st, vec2(0));
      //   d *= noise(uTime + st);
      //   d = smoothstep(0.0, 1.0, d) - step(1.0, d);
      //   gl_FragColor.rgb = vec3(d);
      //   gl_FragColor.a = 1.0;
      // }

      // 效果二
      float lines(in vec2 pos, float b){
        float scale = 10.0;
        pos *= scale;
        return smoothstep(0.0, 0.5 + b * 0.5, abs((sin(pos.x * 3.1415) + b * 2.0)) * 0.5);
      }

      vec2 rotate(vec2 v0, float ang) {
        float sinA = sin(ang);
        float cosA = cos(ang);
        mat3 m = mat3(cosA, -sinA, 0, sinA, cosA, 0, 0, 0, 1);
        return (m * vec3(v0, 1.0)).xy;
      }

      void main() {
        vec2 st = vUv.yx * vec2(10.0, 3.0);
        st = rotate(st, noise(st));

        float d = lines(st, 0.5);

        gl_FragColor.rgb = 1.0 - vec3(d);
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
      renderer.uniforms.uTime = t / 1000;
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
