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
  Sphere,
  Box,
  Cylinder,
  Torus,
} from 'ogl';
import * as dat from 'dat.gui';

import styles from './index.less';

const Light: React.FC<{}> = (props) => {
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

    const sphereGeometry = new Sphere(gl);
    const cubeGeometry = new Box(gl);
    const cylinderGeometry = new Cylinder(gl);
    const torusGeometry = new Torus(gl);

    const vertex = /* glsl */ `
      precision highp float;
      attribute vec3 position;
      attribute vec3 normal;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat4 viewMatrix;
      uniform mat3 normalMatrix;
      uniform vec3 directionalLight;
      
      varying vec3 vNormal;
      varying vec3 vDir;
      void main() {
        // 计算光线方向
        vec4 invDirectional = viewMatrix * vec4(directionalLight, 0.0);
        vDir = -invDirectional.xyz;
        // 计算法向量
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      uniform vec3 ambientLight;
      uniform vec3 materialReflection;
      uniform vec3 directionalLightColor;
      varying vec3 vNormal;
      varying vec3 vDir;
      void main() {
        // 求光线与法线夹角的余弦
        float cos = max(dot(normalize(vDir), vNormal), 0.0);
        // 计算漫反射
        vec3 diffuse = cos * directionalLightColor;
        // 合成颜色
        gl_FragColor.rgb = (ambientLight + diffuse) * materialReflection;
        gl_FragColor.a = 1.0;
      }
    `;

    const ambientLight = { value: [0.5, 0.5, 0.5] };

    const directional = {
      directionalLight: { value: [1, 0, 0] },
      directionalLightColor: { value: [1, 1, 1] },
    };

    const program1 = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        ambientLight,
        materialReflection: { value: [0, 0, 1] },
        ...directional,
      },
    });
    const program2 = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        ambientLight,
        materialReflection: { value: [1, 0, 1] },
        ...directional,
      },
    });
    const program3 = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        ambientLight,
        materialReflection: { value: [0, 0.5, 0] },
        ...directional,
      },
    });
    const program4 = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        ambientLight,
        materialReflection: { value: [1, 0, 0] },
        ...directional,
      },
    });

    const controls = new Orbit(camera);

    const torus = new Mesh(gl, { geometry: torusGeometry, program: program1 });
    torus.position.set(0, 1.3, 0);
    torus.setParent(scene);

    const sphere = new Mesh(gl, { geometry: sphereGeometry, program: program2 });
    sphere.position.set(1.3, 0, 0);
    sphere.setParent(scene);

    const cube = new Mesh(gl, { geometry: cubeGeometry, program: program3 });
    cube.position.set(0, -1.3, 0);
    cube.setParent(scene);

    const cylinder = new Mesh(gl, { geometry: cylinderGeometry, program: program4 });
    cylinder.position.set(-1.3, 0, 0);
    cylinder.setParent(scene);

    requestAnimationFrame(update);
    function update() {
      requestAnimationFrame(update);
      controls.update();

      // torus.rotation.y -= 0.02;
      // sphere.rotation.y -= 0.03;
      // cube.rotation.y -= 0.04;
      // cylinder.rotation.y -= 0.02;

      renderer.render({ scene, camera });
    }

    const gui = new dat.GUI();
    const palette = {
      light: '#FFFFFF',
      reflection1: '#0000FF',
      reflection2: '#FF00FF',
      reflection3: '#008000',
      reflection4: '#FF0000',
    };
    gui.addColor(palette, 'light').onChange((val) => {
      const color = new Color(val);
      program1.uniforms.ambientLight.value = color;
      program2.uniforms.ambientLight.value = color;
      program3.uniforms.ambientLight.value = color;
      program4.uniforms.ambientLight.value = color;
    });
    gui.addColor(palette, 'reflection1').onChange((val) => {
      program1.uniforms.materialReflection.value = new Color(val);
    });
    gui.addColor(palette, 'reflection2').onChange((val) => {
      program2.uniforms.materialReflection.value = new Color(val);
    });
    gui.addColor(palette, 'reflection3').onChange((val) => {
      program3.uniforms.materialReflection.value = new Color(val);
    });
    gui.addColor(palette, 'reflection4').onChange((val) => {
      program4.uniforms.materialReflection.value = new Color(val);
    });
  };

  return (
    <div className={styles.main}>
      <canvas id="canvas" className={styles.canv} width={600} height={600} />
    </div>
  );
};

export default Light;
