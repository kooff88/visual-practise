import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import { multiply } from '@/pages/common/math/functions/Mat4Func.js';
import styles from './index.less';

const ThreeD: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const vertex = `
      attribute vec3 a_vertexPosition;
      attribute vec4 color;
      varying vec4 vColor;
      uniform mat4 projectionMatrix;
      uniform mat4 modelMatrix;
      void main() {
        gl_PointSize = 1.0;
        vColor = color;
        gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);
      }
  `;

    const fragment = `
      #ifdef GL_ES
      precision highp float;
      #endif
      varying vec4 vColor;
      void main() {
        gl_FragColor = vColor;
      }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas, {
      depth: true,
    });

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    function cube(size = 1.0, colors = [[1, 0, 0, 1]]) {
      const h = 0.5 * size;
      const vertices = [
        [-h, -h, -h],
        [-h, h, -h],
        [h, h, -h],
        [h, -h, -h],
        [-h, -h, h],
        [-h, h, h],
        [h, h, h],
        [h, -h, h],
      ];

      const positions = [];
      const color = [];
      const cells = [];

      let colorIdx = 0;
      let cellsIdx = 0;
      const colorLen = colors.length;

      function quad(a, b, c, d) {
        [a, b, c, d].forEach((i) => {
          positions.push(vertices[i]);
          color.push(colors[colorIdx % colorLen]);
        });
        cells.push(
          [0, 1, 2].map((i) => i + cellsIdx),
          [0, 2, 3].map((i) => i + cellsIdx),
        );
        colorIdx++;
        cellsIdx += 4;
      }
      quad(1, 0, 3, 2);
      quad(4, 5, 6, 7);
      quad(2, 3, 7, 6);
      quad(5, 4, 0, 1);
      quad(3, 0, 4, 7);
      quad(6, 5, 1, 2);

      return { positions, color, cells };
    }

    const geometry = cube(1.0, [
      [1, 0, 0, 1],
      [0, 0.5, 0, 1],
      [0, 0, 1, 1],
    ]);

    renderer.uniforms.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1];

    function fromRotation(rotationX, rotationY, rotationZ) {
      let c = Math.cos(rotationX);
      let s = Math.sin(rotationX);
      const rx = [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];

      c = Math.cos(rotationY);
      s = Math.sin(rotationY);
      const ry = [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1];

      c = Math.cos(rotationZ);
      s = Math.sin(rotationZ);
      const rz = [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

      const ret = [];
      multiply(ret, rx, ry);
      multiply(ret, ret, rz);

      return ret;
    }

    renderer.setMeshData([
      {
        positions: geometry.positions,
        attributes: {
          color: geometry.color,
        },
        cells: geometry.cells,
      },
    ]);
    let rotationX = 0;
    let rotationY = 0;
    let rotationZ = 0;

    function update() {
      rotationX += 0.003;
      rotationY += 0.005;
      rotationZ += 0.007;
      renderer.uniforms.modelMatrix = fromRotation(rotationX, rotationY, rotationZ);
      requestAnimationFrame(update);
    }
    update();

    renderer.render();
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={600} height={600} />
    </div>
  );
};

export default ThreeD;
