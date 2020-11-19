import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Maze: React.FC<{}> = (props) => {
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

    //   const fragment = `
    //   #ifdef GL_ES
    //   precision mediump float;
    //   #endif

    //   varying vec2 vUv;

    //   uniform vec2 u_resolution;
    //   uniform int rows;

    //   float random (in vec2 _st) {
    //     return fract(sin(dot(_st.xy,
    //                         vec2(12.9898,78.233)))*
    //         43758.5453123);
    //   }

    //   vec2 truchetPattern(in vec2 _st, in float _index){
    //     _index = fract(((_index-0.5)*2.0));
    //     if (_index > 0.75) {
    //         _st = vec2(1.0) - _st;
    //     } else if (_index > 0.5) {
    //         _st = vec2(1.0-_st.x,_st.y);
    //     } else if (_index > 0.25) {
    //         _st = 1.0-vec2(1.0-_st.x,_st.y);
    //     }
    //     return _st;
    //   }

    //   void main() {
    //     vec2 st = vUv * float(rows);
    //     vec2 ipos = floor(st);  // integer
    //     vec2 fpos = fract(st);  // fraction
    //     vec2 tile = truchetPattern(fpos, random( ipos ));
    //     float color = 0.0;
    //     color = smoothstep(tile.x-0.3,tile.x,tile.y)-
    //             smoothstep(tile.x,tile.x+0.3,tile.y);
    //     gl_FragColor = vec4(vec3(color),1.0);
    //   }
    // `;
    const fragment = `
      #ifdef GL_ES
      precision highp float;
      #endif
      varying vec2 vUv;
      uniform vec2 center;
      uniform float scale;
      uniform int iterations;
      
      vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
        float x = 1.0 / 3.0;
        if (t < x) return mix(c1, c2, t/x);
        else if (t < 2.0 * x) return mix(c2, c3, (t - x)/x);
        else if (t < 3.0 * x) return mix(c3, c4, (t - 2.0*x)/x);
        return c4;
      }
      vec2 f(vec2 z, vec2 c) {
        return mat2(z, -z.y, z.x) * z + c;
      }
      void main() {
          vec2 uv = vUv;
          vec2 c = center + 4.0 * (uv - vec2(0.5)) / scale;
          vec2 z = vec2(0.0);
          bool escaped = false;
          int j;
          for (int i = 0; i < 65536; i++) {
            if(i > iterations) break;
            j = i;
            z = f(z, c);
            if (length(z) > 2.0) {
              escaped = true;
              break;
            }
          }
          // gl_FragColor.rgb = escaped ? vec3(1.0) : vec3(0.0);
          gl_FragColor.rgb = escaped ? max(1.0, log(scale)) * palette(float(j)/ float(iterations), vec3(0.02, 0.02, 0.03), vec3(0.1, 0.2, 0.3), vec3(0.0, 0.3, 0.2), vec3(0.0, 0.5, 0.8))
             : vec3(0.0);
          gl_FragColor.a = 1.0;
      }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    renderer.uniforms.center = [0.367, 0.303];
    renderer.uniforms.scale = 1;
    renderer.uniforms.iterations = 256;

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

    function update() {
      const factor = Math.max(0.1, Math.log(renderer.uniforms.scale));
      renderer.uniforms.scale = (renderer.uniforms.scale += factor) % 10000;
      renderer.uniforms.iterations = factor * 500;
      requestAnimationFrame(update);
    }
    setTimeout(update, 2000);
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={1200} height={600} />
    </div>
  );
};

export default Maze;
