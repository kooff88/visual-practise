import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
// import { Renderer, Program, Geometry, Transform, Mesh } from 'ogl';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Performance: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    const vertex = `
      attribute vec3 a_vertexPosition;

      uniform float uTime;

      highp float random(vec2 co ){
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
      }

      varying vec3 vColor;

      void main(){
        vec2 pos = a_vertexPosition.xy;
        float t = a_vertexPosition.z / 10000.0;

        float alpha = 6.28 * random(vec2(uTime, 2.0 + t));
        float c = cos(alpha);
        float s = sin(alpha);

        mat3 modelMatrix = mat3(
          c, -s, 0,
          s, c, 0,
          2.0 * random(vec2(uTime, t)) - 1.0, 2.0 * random(vec2(uTime, 1.0 + t)) - 1.0, 1
        );

        vColor = vec3(
          random(vec2(uTime, 4.0 + t)),
          random(vec2(uTime, 5.0 + t)),
          random(vec2(uTime, 6.0 + t))
        );

        gl_Position = vec4(modelMatrix * vec3(pos, 1), 1);
      }
    `;

    const fragment = `
      #ifdef GL_ES
      precision highp float;
      #endif
      varying vec3 vColor;
      
      void main() {
        gl_FragColor.rgb = vColor;
        gl_FragColor.a = 1.0;
      }
    `;

    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    const COUNT = 3000;

    function createShapes(count) {
      const positions = new Float32Array(count * 6 * 3); // 最多6边形
      const cells = new Int16Array(count * 4 * 3); // 索引数等于3倍顶点数-2
      positions.fill(0);
      cells.fill(0);
    
      let offset = 0;
      let cellsOffset = 0;
      for(let i = 0; i < count; i++) {
        const edges = 3 + Math.floor(4 * Math.random());

        const delta = 2 * Math.PI / edges;

        for(let j = 0; j < edges; j++) {
          const angle = j * delta;
          positions.set([0.1 * Math.sin(angle), 0.1 * Math.cos(angle), i], (offset + j) * 3);
          if(j > 0 && j < edges - 1) {
            cells.set([offset, offset + j, offset + j + 1], cellsOffset);
            cellsOffset += 3;
          }
        }
        offset += edges;
      }
      return { positions, cells };
    }

    const {positions, cells} = createShapes(COUNT);

    renderer.setMeshData([{
      positions,
      cells,
    }]);

    function render(t) {
      renderer.uniforms.uTime = t / 1e6;
      renderer.render();
      requestAnimationFrame(render);
    }

    render(0);

  };

  return (
    <div className={styles.main}>
        <canvas width="600" height="600"></canvas>
    </div>
  );
};

export default Performance;
