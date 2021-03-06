import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import { multiply } from '@/pages/common/math/functions/Mat4Func.js';
import { cross, subtract, normalize } from '@/pages/common/math/functions/Vec3Func.js';
import { normalFromMat4 } from '@/pages/common/math/functions/Mat3Func.js';
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
    attribute vec3 normal;
    varying vec4 vColor;
    varying float vCos;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    uniform mat3 normalMatrix;
    
    const vec3 lightPosition = vec3(1, 0, 0);
    void main() {
      gl_PointSize = 1.0;
      vColor = color;
      vec4 pos =  modelMatrix * vec4(a_vertexPosition, 1.0);
      vec3 invLight = lightPosition - pos.xyz;
      vec3 norm = normalize(normalMatrix * normal);
      vCos = max(dot(normalize(invLight), norm), 0.0);
      gl_Position = projectionMatrix * pos;
    }
  `;

    const fragment = `
      #ifdef GL_ES
      precision highp float;
      #endif
      uniform vec4 lightColor;
      varying vec4 vColor;
      varying float vCos;
      void main() {
        gl_FragColor.rgb = vColor.rgb + vCos * lightColor.a * lightColor.rgb;
        gl_FragColor.a = vColor.a;
      }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas, {
      depth: true,
    });

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    function cylinder(
      radius = 1.0,
      height = 1.0,
      segments = 30,
      colorCap = [0, 0, 1, 1],
      colorSide = [1, 0, 0, 1],
    ) {
      const positions = [];
      const cells = [];
      const color = [];
      const cap = [[0, 0]];
      const h = 0.5 * height;
      const normal = [];

      // 顶和底的圆
      for (let i = 0; i <= segments; i++) {
        const theta = (Math.PI * 2 * i) / segments;
        const p = [radius * Math.cos(theta), radius * Math.sin(theta)];
        cap.push(p);
      }

      positions.push(...cap.map(([x, y]) => [x, y, -h]));
      normal.push(...cap.map(() => [0, 0, -1]));
      for (let i = 1; i < cap.length - 1; i++) {
        cells.push([0, i, i + 1]);
      }
      cells.push([0, cap.length - 1, 1]);

      let offset = positions.length;
      positions.push(...cap.map(([x, y]) => [x, y, h]));
      normal.push(...cap.map(() => [0, 0, 1]));
      for (let i = 1; i < cap.length - 1; i++) {
        cells.push([offset, offset + i, offset + i + 1]);
      }
      cells.push([offset, offset + cap.length - 1, offset + 1]);

      color.push(...positions.map(() => colorCap));

      const tmp1 = [];
      const tmp2 = [];
      // 侧面
      offset = positions.length;
      for (let i = 1; i < cap.length; i++) {
        const a = [...cap[i], h];
        const b = [...cap[i], -h];
        const nextIdx = i < cap.length - 1 ? i + 1 : 1;
        const c = [...cap[nextIdx], -h];
        const d = [...cap[nextIdx], h];

        positions.push(a, b, c, d);

        const norm = [];
        cross(norm, subtract(tmp1, b, a), subtract(tmp2, c, a));
        normalize(norm, norm);
        normal.push(norm, norm, norm, norm);

        color.push(colorSide, colorSide, colorSide, colorSide);
        cells.push([offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]);
        offset += 4;
      }

      return { positions, cells, color, normal };
    }

    const geometry = cylinder(0.5, 1.0, 30, [0, 0, 1, 1], [0.5, 0.5, 0.5, 1]);

    renderer.uniforms.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1];

    renderer.uniforms.lightColor = [1, 0, 0, 0.8];

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
          normal: geometry.normal,
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
      const modelMatrix = fromRotation(rotationX, rotationY, rotationZ);
      renderer.uniforms.modelMatrix = modelMatrix;
      renderer.uniforms.normalMatrix = normalFromMat4([], modelMatrix);
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
