import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from 'd3';
import earcut from 'earcut';
import styles from './index.less';
import generateCalendar from 'antd/lib/calendar/generateCalendar';

const Circle1: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    const vertex = `
    #define PI 3.1415926535897932384626433832795
    attribute vec2 position;
    varying vec4 vColor;
    
    vec3 rgb2hsv(vec3 c){
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    
    // 都是(0, 1)
    vec3 hsv2rgb(vec3 c){
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
      rgb = rgb * rgb * (3.0 - 2.0 * rgb);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }
    
    void main(){
      
      // 两个圆的圆心分别在 (-0.5, 0), (0.5, 0), 将其转到(0, 0)方便计算
      float x = position.x > 0.0 ? position.x - 0.5 : position.x + 0.5;
      float y = position.y;
    
      float hue = atan(position.y, x);
      if (0.0 > hue) {
        hue = PI * 2.0 + hue;
      }
    
      hue /= 2.0 * PI;
    
      float len = sqrt(x * x + y * y);
      // 判断是哪一个圆, 使用不同的颜色
      vec3 hsv = position.x > 0.0 ? vec3(hue, len, 1.0) : vec3(hue, 1.0, len);
      vec3 rgb = hsv2rgb(hsv);
      vColor = vec4(rgb, 1.0);
      gl_Position = vec4(position, 1.0, 1.0);
    }
    `;

    const fragment = `
    precision mediump float;
    varying vec4 vColor;
    void main(){
      gl_FragColor = vColor;
    }
    `;
    const program = generateProgram(gl, vertex, fragment);
    gl.useProgram(program);

    const circle1 = generateCircle(0.4, 100, -0.5, 0);
    const circle2 = generateCircle(0.4, 100, 0.5, 0);

    draw(program, circle1, gl);
    draw(program, circle2, gl);
  };

  const draw = (program, circle, gl) => {
    const points = circle.flat();
    const cell = earcut(points);

    const position = new Float32Array(points);
    const cells = new Uint16Array(cell);

    const pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    const cellsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, cell.length, gl.UNSIGNED_SHORT, 0);
  };

  const generateCircle = (r, seg, x, y) => {
    const res = [];
    for (let i = 0; i < seg; i++) {
      const angle = (i * 2 * Math.PI) / seg;
      res.push([r * Math.cos(angle) + x, r * Math.sin(angle) + y]);
    }
    return res;
  };

  const createShader = (gl, type, source) => {
    // 着色器对象
    const shader = gl.createShader(type);

    // 提供数据源
    gl.shaderSource(shader, source);

    // 编译 =》生成着色器
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;
  };

  const generateProgram = (gl, vertex, fragment) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      console.log('link成功');
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    return program;
  };

  return (
    <div className={styles.main}>
      <canvas width={600} height={600} />
    </div>
  );
};

export default Circle1;
