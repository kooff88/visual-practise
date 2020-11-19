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
  Color,
  Texture,
  Vec3,
  Vec2,
} from 'ogl';
import * as dat from 'dat.gui';
import { Phong, Material, vertex as v, fragment as f } from '@/pages/common/phong.js';

import cubeJson from '@/pages/common/assets/rounded-cube.json';
import rocknormal from '@/pages/common/assets/rock_normal.jpg';
import rock from '@/pages/common/assets/rock.jpg';

import styles from './index.less';

console.log('datadatadsdasdasd', dat);

const NormalMaps: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const vertex = `#version 300 es
      precision highp float;
      in vec3 position;
      in vec3 normal;
      in vec2 uv;
      in vec3 tang;
      in vec3 bitang;
      uniform mat4 modelMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat3 normalMatrix;
      uniform vec3 cameraPosition;
      out vec3 vNormal;
      out vec3 vPos;
      out vec2 vUv;
      out vec3 vCameraPos;
      out mat3 vTBN;
      void main() {
        vec4 pos = modelViewMatrix * vec4(position, 1.0);
        vPos = pos.xyz;
        vUv = uv;
        vCameraPos = (viewMatrix * vec4(cameraPosition, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);
        vec3 N = vNormal;
        vec3 T = normalize(normalMatrix * tang);
        vec3 B = normalize(normalMatrix * bitang);
        vTBN = mat3(T, B, N);
        
        gl_Position = projectionMatrix * pos;
      }
    `;

    const fragment = `#version 300 es
      precision highp float;
      #define MAX_LIGHT_COUNT 16
      uniform mat4 viewMatrix;
      uniform vec3 ambientLight;
      uniform vec3 directionalLightDirection[MAX_LIGHT_COUNT];
      uniform vec3 directionalLightColor[MAX_LIGHT_COUNT];
      uniform vec3 pointLightColor[MAX_LIGHT_COUNT];
      uniform vec3 pointLightPosition[MAX_LIGHT_COUNT];
      uniform vec3 pointLightDecay[MAX_LIGHT_COUNT];
      uniform vec3 spotLightColor[MAX_LIGHT_COUNT];
      uniform vec3 spotLightDirection[MAX_LIGHT_COUNT];
      uniform vec3 spotLightPosition[MAX_LIGHT_COUNT];
      uniform vec3 spotLightDecay[MAX_LIGHT_COUNT];
      uniform float spotLightAngle[MAX_LIGHT_COUNT];
      uniform vec3 materialReflection;
      uniform float shininess;
      uniform float specularFactor;
      uniform sampler2D tMap;
      uniform sampler2D tNormal;
      in vec3 vNormal;
      in vec3 vPos;
      in vec2 vUv;
      in vec3 vCameraPos;
      in mat3 vTBN;
      out vec4 FragColor;
      float getSpecular(vec3 dir, vec3 normal, vec3 eye) {
        vec3 reflectionLight = reflect(-dir, normal);
        float eyeCos = max(dot(eye, reflectionLight), 0.0);
        return specularFactor *  pow(eyeCos, shininess);
      }
      vec4 phongReflection(vec3 pos, vec3 normal, vec3 eye) {
        float specular = 0.0;
        vec3 diffuse = vec3(0);
        
        // 处理平行光
        for(int i = 0; i < MAX_LIGHT_COUNT; i++) {
          vec3 dir = directionalLightDirection[i];
          if(dir.x == 0.0 && dir.y == 0.0 && dir.z == 0.0) continue;
          vec4 d = viewMatrix * vec4(dir, 0.0);
          dir = normalize(-d.xyz);
          float cos = max(dot(dir, normal), 0.0);
          diffuse += cos * directionalLightColor[i];
          specular += getSpecular(dir, normal, eye);
        }
        // 处理点光源
        for(int i = 0; i < MAX_LIGHT_COUNT; i++) {
          vec3 decay = pointLightDecay[i];
          if(decay.x == 0.0 && decay.y == 0.0 && decay.z == 0.0) continue;
          vec3 dir = (viewMatrix * vec4(pointLightPosition[i], 1.0)).xyz - pos;
          float dis = length(dir);
          dir = normalize(dir);
          float cos = max(dot(dir, normal), 0.0);
          float d = min(1.0, 1.0 / (decay.x * pow(dis, 2.0) + decay.y * dis + decay.z));
          diffuse += d * cos * pointLightColor[i];
          specular += getSpecular(dir, normal, eye);
        }
        // 处理聚光灯
        for(int i = 0; i < MAX_LIGHT_COUNT; i++) {
          vec3 decay = spotLightDecay[i];
          if(decay.x == 0.0 && decay.y == 0.0 && decay.z == 0.0) continue;
          vec3 dir = (viewMatrix * vec4(spotLightPosition[i], 1.0)).xyz - pos;
          float dis = length(dir);
          dir = normalize(dir);
          // 聚光灯的朝向
          vec3 spotDir = (viewMatrix * vec4(spotLightDirection[i], 0.0)).xyz;
          // 通过余弦值判断夹角范围
          float ang = cos(spotLightAngle[i]);
          float r = step(ang, dot(dir, normalize(-spotDir)));
          float cos = max(dot(dir, normal), 0.0);
          float d = min(1.0, 1.0 / (decay.x * pow(dis, 2.0) + decay.y * dis + decay.z));
          diffuse += r * d * cos * spotLightColor[i];
          specular += r * getSpecular(dir, normal, eye);
        }
        return vec4(diffuse, specular);
      }
      vec3 getNormal() {
        vec3 n = texture(tNormal, vUv).rgb * 2.0 - 1.0;
        n.xy *= 2.0;
        return normalize(vTBN * n);
      }
      // vec3 getNormal() {
      //   vec3 pos_dx = dFdx(vPos.xyz);
      //   vec3 pos_dy = dFdy(vPos.xyz);
      //   vec2 tex_dx = dFdx(vUv);
      //   vec2 tex_dy = dFdy(vUv);
      //   vec3 t = normalize(pos_dx * tex_dy.t - pos_dy * tex_dx.t);
      //   vec3 b = normalize(-pos_dx * tex_dy.s + pos_dy * tex_dx.s);
      //   mat3 tbn = mat3(t, b, normalize(vNormal));
      //   vec3 n = texture(tNormal, vUv).rgb * 2.0 - 1.0;
      //   return normalize(tbn * n);
      // }
      uniform float uTime;
      void main() {
        vec3 eyeDirection = normalize(vCameraPos - vPos);
        vec3 normal = getNormal();
        vec4 phong = phongReflection(vPos, normal, eyeDirection);
        // vec4 phong = phongReflection(vPos, vNormal, eyeDirection);
        vec3 tex = texture(tMap, vUv).rgb;
        vec3 light = normalize(vec3(sin(uTime), 1.0, cos(uTime)));
        float shading = dot(normal, light) * 0.5;
        
        FragColor.rgb = tex + shading;
        FragColor.a = 1.0;
      }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new Renderer({
      canvas,
      width: 512,
      height: 512,
      antialias: true,
      alpha: true,
    });

    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);
    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(2, 2, 2);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();

    const phong = new Phong();
    phong.addLight({
      // color: [1, 0.5, 0.5],
      direction: [0, -3, -3],
    });
    phong.addLight({
      // color: [1, 0.5, 1],
      direction: [0, 3, 3],
    });
    const matrial = new Material(new Color('#808080'));

    function loadTexture(src) {
      const texture = new Texture(gl);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          texture.image = img;
          resolve(texture);
        };
        img.src = src;
      });
    }

    function createTB(geometry) {
      const { position, index, uv } = geometry.attributes;
      if (!uv) throw new Error('NO uv.');
      function getTBNTriangle(p1, p2, p3, uv1, uv2, uv3) {
        const edge1 = new Vec3().sub(p2, p1);
        const edge2 = new Vec3().sub(p3, p1);
        const deltaUV1 = new Vec2().sub(uv2, uv1);
        const deltaUV2 = new Vec2().sub(uv3, uv1);

        const tang = new Vec3();
        const bitang = new Vec3();

        const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);

        tang.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
        tang.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
        tang.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);

        tang.normalize();

        bitang.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
        bitang.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
        bitang.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);

        bitang.normalize();

        return { tang, bitang };
      }

      const size = position.size;
      if (size < 3) throw new Error('Error dimension.');

      const len = position.data.length / size;
      const tang = new Float32Array(len * 3);
      const bitang = new Float32Array(len * 3);

      const ilen = index ? index.data.length : len;

      for (let i = 0; i < ilen; i += 3) {
        const i1 = index ? index.data[i] : i;
        const i2 = index ? index.data[i + 1] : i + 1;
        const i3 = index ? index.data[i + 2] : i + 2;

        const p1 = [
          position.data[i1 * size],
          position.data[i1 * size + 1],
          position.data[i1 * size + 2],
        ];
        const p2 = [
          position.data[i2 * size],
          position.data[i2 * size + 1],
          position.data[i2 * size + 2],
        ];
        const p3 = [
          position.data[i3 * size],
          position.data[i3 * size + 1],
          position.data[i3 * size + 2],
        ];

        const u1 = [uv.data[i1 * 2], uv.data[i1 * 2 + 1]];
        const u2 = [uv.data[i2 * 2], uv.data[i2 * 2 + 1]];
        const u3 = [uv.data[i3 * 2], uv.data[i3 * 2 + 1]];

        const { tang: t, bitang: b } = getTBNTriangle(p1, p2, p3, u1, u2, u3);
        tang.set(t, i1 * 3);
        tang.set(t, i2 * 3);
        tang.set(t, i3 * 3);
        bitang.set(b, i1 * 3);
        bitang.set(b, i2 * 3);
        bitang.set(b, i3 * 3);
      }
      geometry.addAttribute('tang', { data: tang, size: 3 });
      geometry.addAttribute('bitang', { data: bitang, size: 3 });
      return geometry;
    }

    (async function () {
      const data = cubeJson;
      const normalMap = await loadTexture(rocknormal);
      const texture = await loadTexture(rock);

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          ...phong.uniforms,
          ...matrial.uniforms,
          uTime: { value: 0 },
          tMap: { value: texture },
          tNormal: { value: normalMap },
        },
      });

      const geometry = new Geometry(gl, {
        position: { size: 3, data: new Float32Array(data.position) },
        uv: { size: 2, data: new Float32Array(data.uv) },
        normal: { size: 3, data: new Float32Array(data.normal) },
      });
      createTB(geometry);

      const cube = new Mesh(gl, { geometry, program });
      cube.setParent(scene);
      cube.rotation.x = -Math.PI / 2;
      // renderer.render({scene, camera});

      const controls = new Orbit(camera);
      requestAnimationFrame(update);
      function update(t) {
        requestAnimationFrame(update);
        controls.update();
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene, camera });
      }
    })();
  };

  return (
    <div className={styles.main}>
      <canvas id="canvas" className={styles.canv} width={600} height={600} />
    </div>
  );
};

export default NormalMaps;
