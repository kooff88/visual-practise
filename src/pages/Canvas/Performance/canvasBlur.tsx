

import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import {Renderer, Program, Geometry, Transform, Mesh} from 'ogl';
import styles from './index.less';

const Performance: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    function regularShape(x, y, r, edges = 3) {
      const points = [];
      const delta = 2 * Math.PI / edges;
      for(let i = 0; i < edges; i++) {
        const theta = i * delta;
        points.push([x + r * Math.sin(theta), y + r * Math.cos(theta)]);
      }
      return points;
    }

    function drawShape(context, points) {
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(...points[0]);
      for(let i = 1; i < points.length; i++) {
        context.lineTo(...points[i]);
      }
      context.closePath();
      context.stroke();
      context.fill();
    }

    const shapeTypes = [3, 4, 5, 6, -1];
    const TAU = Math.PI * 2;

    function createCache() {
      const ret = [];
      for(let i = 0; i < shapeTypes.length; i++) {
        const cacheCanvas = new OffscreenCanvas(20, 20);
        const type = shapeTypes[i];
        const context = cacheCanvas.getContext('2d');
        context.fillStyle = 'red';
        context.strokeStyle = 'black';
        if(type > 0) {
          const points = regularShape(10, 10, 10, type);
          drawShape(context, points);
        } else {
          context.beginPath();
          context.arc(10, 10, 10, 0, TAU);
          context.stroke();
          context.fill();
        }
        ret.push(cacheCanvas);
      }
      return ret;
    }

    const shapes = createCache();
    const COUNT = 1000;

    ctx.filter = 'blur(5px)';
    // ctx.filter = 'grayscale(100%)';

    const ofc = new OffscreenCanvas(canvas.width, canvas.height);
    const octx = ofc.getContext('2d');

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      octx.clearRect(0, 0, canvas.width, canvas.height);
      for(let i = 0; i < COUNT; i++) {
        const shape = shapes[Math.floor(Math.random() * shapeTypes.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        octx.drawImage(shape, x, y);
      }
      ctx.drawImage(ofc, 0, 0);
      requestAnimationFrame(draw);

    }

    draw();
      
  };

  return (
    <div className={styles.main}>
        <canvas width="600" height="600"></canvas>
    </div>
  );
};

export default Performance;