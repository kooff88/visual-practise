import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import {
  Renderer,
  Camera,
  Transform,
  Program,
  Geometry,
  Mesh,
  Orbit,
  Texture,
  Polyline,
  Color,
  Vec3,
  Quat,
} from 'ogl';
import * as dat from 'dat.gui';
import geometry1 from '@/pages/common/assets/airplane.json';
import texture1 from '@/pages/common/assets/airplane.jpg';

import styles from './index.less';

console.log('datadatadsdasdasd', dat);

const Affine: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const renderer = new Renderer({
      canvas,
      width: 512,
      height: 512,
    });

    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);
    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, 10);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();

    const vertex = /* glsl */ `
      precision highp float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      uniform sampler2D tMap;
      varying vec2 vUv;
      void main() {
        gl_FragColor = texture2D(tMap, vUv);
      }
    `;

    async function loadModel(geometry1) {
      const data = geometry1;
      console.log('geometry1', geometry1);

      const geometry = new Geometry(gl, {
        position: { size: 3, data: new Float32Array(data.position) },
        uv: { size: 2, data: new Float32Array(data.uv) },
        normal: { size: 3, data: new Float32Array(data.normal) },
      });

      return geometry;
    }

    function loadTexture(texture1) {
      const texture = new Texture(gl);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          texture.image = img;
          resolve(texture1);
        };
        img.src = texture1;
      });
    }

    const controls = new Orbit(camera);

    async function aa() {
      console.log('123', 123);
      const geometry = await loadModel(geometry1);
      const texture = await loadTexture(texture1);
      console.log('333', 333);

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: { value: texture },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      const points = [new Vec3(0, 0, 0), new Vec3(0, 10, 0)];

      const axis = new Polyline(gl, {
        points,
        uniforms: {
          uColor: { value: new Color('#f00') },
          uThickness: { value: 3 },
        },
      });
      axis.mesh.setParent(scene);
      renderer.render({ scene, camera });

      const gui = new dat.GUI();
      const palette = {
        alpha: 0,
        x: 0,
        y: 1,
        z: 0,
      };

      function updateAxis() {
        const { x, y, z } = palette;
        const v = new Vec3(x, y, z).normalize().scale(10);
        points[1].copy(v);
        axis.updateGeometry();
        renderer.render({ scene, camera });
      }

      function updateQuaternion(val) {
        const theta = ((0.5 * val) / 180) * Math.PI;
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        const p = new Vec3().copy(points[1]).normalize();
        const q = new Quat(p.x * s, p.y * s, p.z * s, c);
        mesh.quaternion = q;
        renderer.render({ scene, camera });
      }
      gui.add(palette, 'x', -10, 10).onChange(updateAxis);
      gui.add(palette, 'y', -10, 10).onChange(updateAxis);
      gui.add(palette, 'z', -10, 10).onChange(updateAxis);
      gui.add(palette, 'alpha', -180, 180).onChange(updateQuaternion);

      requestAnimationFrame(update);
      function update() {
        requestAnimationFrame(update);
        // controls.update();
        renderer.render({ scene, camera });
      }
    }

    aa();
  };

  return (
    <div className={styles.main}>
      <canvas id="canvas" className={styles.canv} width={600} height={600} />
    </div>
  );
};

export default Affine;
