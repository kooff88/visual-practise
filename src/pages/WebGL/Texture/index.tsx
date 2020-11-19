import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Texture: React.FC<{}> = (props) => {
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

    // 灰度
    // const fragment = `
    //   #ifdef GL_ES
    //   precision highp float;
    //   #endif
    //   uniform sampler2D tMap;
    //   uniform mat4 colorMatrix;
    //   varying vec2 vUv;
    //   void main() {
    //       vec4 color = texture2D(tMap, vUv);
    //       gl_FragColor = colorMatrix * vec4(color.rgb, 1.0);
    //       gl_FragColor.a = color.a;
    //   }
    // `;

    // // 粒子化
    // const fragment = `
    //   #ifdef GL_ES
    //   precision highp float;
    //   #endif

    //   uniform sampler2D tMap;
    //   uniform float uTime;
    //   varying vec2 vUv;

    //   float random (vec2 st){
    //     return fract(sin(dot(st.xy,
    //       vec2(12.9898,78.233)))*
    //     43758.5453123);
    //   }

    //   void main() {
    //     vec2 st = vUv * vec2(100, 55.4);
    //     vec2 uv = vUv + 1.0 - 2.0 * random(floor(st));
    //     vec4 color = texture2D(tMap, mix(uv, vUv, min(uTime, 1.0)));
    //     gl_FragColor.rgb = color.rgb;
    //     gl_FragColor.a = color.a * uTime;
    // }
    // `;

    // 合并图片
    // const fragment = `
    //   #ifdef GL_ES
    //   precision highp float;
    //   #endif

    //   uniform sampler2D tMap;
    //   uniform sampler2D tCat;
    //   varying vec2 vUv;

    //   void main() {
    //     vec4 color = texture2D(tMap, vUv);
    //     vec2 st = vUv * 3.0 - vec2(1.2, 0.5);
    //     vec4 cat = texture2D(tCat, st);
    //     gl_FragColor.rgb = cat.rgb;
    //     if(cat.r < 0.5 && cat.g > 0.6) {
    //       gl_FragColor.rgb = color.rgb;
    //     }
    //     gl_FragColor.a = color.a;
    // }
    // `;

    const fragment = `
 
      #ifdef GL_ES
      precision highp float;
      #endif

      uniform sampler2D tMap;
      uniform vec2 uResolution;
      uniform float uTime;
      varying vec2 vUv;

      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                              vec2(12.9898,78.233)))*
              43758.5453123);
      }

      void main() {
          vec2 uv = vUv;
          uv.y *= uResolution.y / uResolution.x;
          vec2 st = uv * 100.0;
          float d = distance(fract(st), vec2(0.5));
          float p = uTime + random(floor(st));
          float shading = 0.5 + 0.5 * sin(p);
          d = smoothstep(d, d + 0.01, 1.0 * shading);
          vec4 color = texture2D(tMap, vUv);
          gl_FragColor.rgb = color.rgb * clamp(0.5, 1.3, d + 1.0 * shading);
          gl_FragColor.a = color.a;
      }

      `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);
    renderer.uniforms.rows = 20;
    // renderer.uniforms.uTime = 0.0;

    (async function () {
      const [picture, cat] = await Promise.all([
        renderer.loadTexture('https://p1.ssl.qhimg.com/t01cca5849c98837396.jpg'),
        renderer.loadTexture('https://p0.ssl.qhimg.com/t0147f674ee72c403cf.jpg'),
      ]);

      renderer.uniforms.tMap = picture;
      renderer.uniforms.tCat = cat;
      renderer.uniforms.uResolution = [canvas.width, canvas.height];
      renderer.uniforms.uTime = 0;
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
    })();

    // requestAnimationFrame(function update(t) {
    //   renderer.uniforms.uTime = (4 * t) / 1000;
    //   requestAnimationFrame(update);
    // });

    function update(t) {
      renderer.uniforms.uTime = t / 1000;
      requestAnimationFrame(update);
    }

    update(0);
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={1200} height={600} />
    </div>
  );
};

export default Texture;
