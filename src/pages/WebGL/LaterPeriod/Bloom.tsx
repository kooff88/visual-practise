import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import GlRenderer from 'gl-renderer';
import styles from './index.less';

const Bloom: React.FC<{}> = (props) => {
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

float line_distance(in vec2 st, in vec2 a, in vec2 b) {
  vec3 ab = vec3(b - a, 0);
  vec3 p = vec3(st - a, 0);
  float l = length(ab);
  return cross(p, normalize(ab)).z;
}

float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
  vec3 ab = vec3(b - a, 0);
  vec3 p = vec3(st - a, 0);
  float l = length(ab);
  float d = abs(cross(p, normalize(ab)).z);
  float proj = dot(p, ab) / l;
  if(proj >= 0.0 && proj <= l) return d;
  return min(distance(st, a), distance(st, b));
}

float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
  float d1 = line_distance(st, a, b);
  float d2 = line_distance(st, b, c);
  float d3 = line_distance(st, c, a);

  if(d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0) {
    return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负
  }
  
  return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部为正
}

float random (vec2 st) {
  return fract(sin(dot(st.xy,
                      vec2(12.9898,78.233)))*
      43758.5453123);
}

vec3 hsb2rgb(vec3 c){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  st *= 10.0;
  vec2 i_st = floor(st);
  vec2 f_st = 2.0 * fract(st) - vec2(1);
  float r = random(i_st);
  float sign = 2.0 * step(0.5, r) - 1.0;
  
  float d = triangle_distance(f_st, vec2(-1), vec2(1), sign * vec2(1, -1));
  gl_FragColor.rgb = (smoothstep(-0.85, -0.8, d) - smoothstep(0.0, 0.05, d)) * hsb2rgb(vec3(r + 1.2, 0.5, r));
  gl_FragColor.a = 1.0;
}
    `;

    const blurFragment = `
      #ifdef GL_ES
      precision highp float;
      #endif
      varying vec2 vUv;
      uniform sampler2D tMap;
      uniform int axis;
      uniform float filter;
      void main() {
        vec4 color = texture2D(tMap, vUv);
        float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
        brightness = step(filter, brightness);
        // 高斯矩阵的权重值
        float weight[5];
        weight[0] = 0.227027;
        weight[1] = 0.1945946;
        weight[2] = 0.1216216;
        weight[3] = 0.054054;
        weight[4] = 0.016216;
        // 每一个相邻像素的坐标间隔，这里的512可以用实际的Canvas像素宽代替
        float tex_offset = 1.0 / 512.0;
        vec3 result = color.rgb;
        result *= weight[0];
        for(int i = 1; i < 5; ++i) {
          float f = float(i);
          if(axis == 0) { // x轴的高斯模糊
            result += texture2D(tMap, vUv + vec2(tex_offset * f, 0.0)).rgb * weight[i];
            result += texture2D(tMap, vUv - vec2(tex_offset * f, 0.0)).rgb * weight[i];
          } else { // y轴的高斯模糊
            result += texture2D(tMap, vUv + vec2(0.0, tex_offset * f)).rgb * weight[i];
            result += texture2D(tMap, vUv - vec2(0.0, tex_offset * f)).rgb * weight[i];
          }
        }
        gl_FragColor.rgb = brightness * result.rgb;
        gl_FragColor.a = color.a;
      }
    `;

    const bloomFragment = `
    #ifdef GL_ES
      precision highp float;
    #endif
    uniform sampler2D tMap;
    uniform sampler2D tSource;
    varying vec2 vUv;
    void main() {
      vec3 color = texture2D(tSource, vUv).rgb;
      vec3 bloomColor = texture2D(tMap, vUv).rgb;
      color += bloomColor;
      // tone mapping
      float exposure = 2.0;
      float gamma = 1.3;
      vec3 result = vec3(1.0) - exp(-color * exposure);
      // also gamma correct while we're at it
      if(length(bloomColor) > 0.0) {
        result = pow(result, vec3(1.0 / gamma));
      }
      gl_FragColor.rgb = result;
      gl_FragColor.a = 1.0;
    }
  `;

    const canvas = document.querySelector('canvas');
    const renderer = new GlRenderer(canvas);

    // load fragment shader and createProgram
    const program = renderer.compileSync(fragment, vertex);
    renderer.useProgram(program);

    // renderer.uniforms.uTime = 0.0;

    // requestAnimationFrame(function update(t) {
    //   renderer.uniforms.uTime = 0.001 * t;
    //   requestAnimationFrame(update);
    // });

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
    const blurProgram = renderer.compileSync(blurFragment, vertex);
    const bloomProgram = renderer.compileSync(bloomFragment, vertex);

    // 创建三个FBO对象，fbo1和fbo2交替使用
    const fbo0 = renderer.createFBO();
    const fbo1 = renderer.createFBO();
    const fbo2 = renderer.createFBO();

    // 第一次，渲染原始图形
    renderer.bindFBO(fbo0);
    renderer.render();

    // 第二次，对x轴高斯模糊
    renderer.useProgram(blurProgram);
    renderer.setMeshData(program.meshData);
    renderer.bindFBO(fbo2);
    renderer.uniforms.tMap = fbo0.texture;
    renderer.uniforms.axis = 0;
    renderer.uniforms.filter = 0.7;
    renderer.render();

    // 第三次，对y轴高斯模糊
    renderer.useProgram(blurProgram);
    renderer.bindFBO(fbo1);
    renderer.uniforms.tMap = fbo2.texture;
    renderer.uniforms.axis = 1;
    renderer.uniforms.filter = 0;
    renderer.render();

    // 第四次，对x轴高斯模糊
    renderer.useProgram(blurProgram);
    renderer.bindFBO(fbo2);
    renderer.uniforms.tMap = fbo1.texture;
    renderer.uniforms.axis = 0;
    renderer.uniforms.filter = 0;
    renderer.render();

    // 第五次，对y轴高斯模糊
    renderer.useProgram(blurProgram);
    renderer.bindFBO(fbo1);
    renderer.uniforms.tMap = fbo2.texture;
    renderer.uniforms.axis = 1;
    renderer.uniforms.filter = 0;
    renderer.render();

    // 第六次，叠加辉光
    renderer.useProgram(bloomProgram);
    renderer.setMeshData(program.meshData);
    renderer.bindFBO(null);
    renderer.uniforms.tSource = fbo0.texture;
    renderer.uniforms.tMap = fbo1.texture;
    renderer.uniforms.axis = 1;
    renderer.uniforms.filter = 0;
    renderer.render();
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={600} height={600} />
      <div className={styles.conic}></div>
    </div>
  );
};

export default Bloom;
