import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import {
  Renderer,
  Camera,
  Transform,
  Program,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Mesh,
  Color,
} from 'ogl';
import styles from './index.less';

const ThreeD: React.FC<{}> = (props) => {
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

    camera.position.set(0, 1, 7);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();

    const sphereGeometry = new Sphere(gl, {
      uniforms: {
        uColor: { value: new Color('#f00') },
        uThickness: { value: 3 },
      },
    });
    const cubeGeometry = new Box(gl);
    const cylinderGeometry = new Cylinder(gl);
    const torusGeometry = new Torus(gl);

    const vertex = /* glsl */ `
    precision highp float;
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main() {
      vec3 normal = normalize(vNormal);
      float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
      gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.1 +uColor;
      gl_FragColor.a = 1.0;
  }
`;

    const program = new Program(gl, {
      vertex,
      fragment,
    });

    const torus = new Mesh(gl, { geometry: torusGeometry, program });
    torus.position.set(0, 1.3, 0);
    torus.setParent(scene);

    const sphere = new Mesh(gl, { geometry: sphereGeometry, program });
    sphere.position.set(1.3, 0, 0);
    sphere.setParent(scene);

    const cube = new Mesh(gl, { geometry: cubeGeometry, program });
    cube.position.set(0, -1.3, 0);
    cube.setParent(scene);

    const cylinder = new Mesh(gl, { geometry: cylinderGeometry, program });
    cylinder.position.set(-1.3, 0, 0);
    cylinder.setParent(scene);

    requestAnimationFrame(update);

    function update() {
      requestAnimationFrame(update);

      torus.rotation.y -= 0.02;
      sphere.rotation.y -= 0.03;
      cube.rotation.y -= 0.04;
      cylinder.rotation.y -= 0.02;

      renderer.render({ scene, camera });
    }
  };

  return (
    <div className={styles.main}>
      <canvas id="canvas" className={styles.canv} width={600} height={600} />
    </div>
  );
};

export default ThreeD;
