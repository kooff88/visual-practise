import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
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
      uniform sampler2D tMap;
      uniform float fWidth;
      uniform vec2 vFrames[3];
      uniform int frameIndex;

      void main() {
        vec2 uv = vUv;
        for (int i = 0; i < 3; i++) {
          uv.x = mix(vFrames[i].x, vFrames[i].y, vUv.x) / fWidth;
          if(float(i) == mod(float(frameIndex), 3.0)) break;
        }
        vec4 color = texture2D(tMap, uv);
        gl_FragColor = color;
      }
  `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    // const program = renderer.compileSync(fragment, vertex);
    // renderer.useProgram(program);

    const textureURL = 'https://p.ssl.qhimg.com/t01f265b6b6479fffc4.png';
    (async function () {
      const texture = await renderer.loadTexture(textureURL);
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      renderer.uniforms.tMap = texture;
      renderer.uniforms.fWidth = 272;
      renderer.uniforms.vFrames = [2, 88, 90, 176, 178, 264];
      renderer.uniforms.frameIndex = 0;
      setInterval(() => {
        renderer.uniforms.frameIndex++;
      }, 200);
      const x = 43 / canvas.width;
      const y = 30 / canvas.height;
      renderer.setMeshData([
        {
          positions: [
            [-x, -y],
            [-x, y],
            [x, y],
            [x, -y],
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
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={600} height={600} />
      <div className={styles.conic}></div>
    </div>
  );
};

export default WebGLA;
