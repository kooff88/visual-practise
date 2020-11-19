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
      function drawRandomTriangle( path, context ) { 
          const { width, height } = context.canvas;
          context.save();
          context.translate(Math.random() * width, Math.random() * height);
          context.fill(path);
          context.restore();
      }

      function drawBackground( context, count = 2000 ) { 
          context.fillStyle = '#ed7';
          const d = 'M0,0L0,10L8.66, 5z';
          const p = new Path2D(d);
          for(let i = 0; i < count; i++) {
            drawRandomTriangle(p, context);
          }
      }

      function loadImage(src) {
          const img = new Image();

          img.crossOrigin = 'anonymous';
          return new Promise((resolve) => {
              img.onload = resolve(img);
              img.src = src;
          });
       }

      async function drawForeground(context) {
        const img = await loadImage('http://p3.qhimg.com/t015b85b72445154fe0.png');
          const { width, height } = context.canvas;
          
          function update(t) {
              context.clearRect(0, 0, width, height);
              context.save();
              context.translate(0, 0.5 * height);
              const p = (t % 3000) / 3000;
              const x = width * p;
              const y = 0.1 * height * Math.sin(3 * Math.PI * p);
              context.drawImage(img, x, y);
              context.restore();
              requestAnimationFrame(update);
            }
            update(0);
       }
      
      
      const bgcanvas = document.querySelector('#bg');
      const fgcanvas  = document.querySelector('#fg');
      drawBackground(bgcanvas.getContext('2d'));
      drawForeground(fgcanvas.getContext('2d'));
      
  };

  return (
    <div className={styles.main}>
        <canvas width="600" height="600" id="bg"></canvas>
        <canvas width="600" height="600" id="fg"></canvas>
    </div>
  );
};

export default Performance;
