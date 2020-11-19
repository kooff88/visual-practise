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

    function regularShape( x, y, r, edges = 3 ) { 
      const points = [];

      const delta = 2 * Math.PI / edges;
      for (let i = 0; i < edges; i++ ) { 
        const theta = i * delta;
        points.push([x + r * Math.sin(theta), y + r * Math.cos(theta)]);
      }
      return points;
    }

    function drawShape( context, points ) { 
      context.fillStyle = 'red';

      context.strokeStyle = 'black';

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

    // const shapeTypes = [3, 4, 5, 6, 100];
    const shapeTypes = [3, 4, 5, 6, -1]; // 优化点： 100边形用圆形替代
    const COUNT = 1000;
    const TAU = Math.PI * 2;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for(let i = 0; i < COUNT; i++) {
        const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        if (type > 0) {
          const points = regularShape(x, y, 10, type);
          drawShape(ctx, points);
        } else { 
          ctx?.beginPath();
          ctx?.arc(x, y, 10, 0, TAU);
          ctx?.stroke();
          ctx?.fill();
        }

      }
      requestAnimationFrame(draw);
    }

    draw();

  };

  return (
    <div className={styles.main}>
      <canvas width={500} height={600} />
    </div>
  );
};

export default Performance;
