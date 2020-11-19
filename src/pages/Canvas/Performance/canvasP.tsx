import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { cubehelix } from 'cubehelix';
import styles from './index.less';

const Performance: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    function randamColor() { 
      return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    function drawCircle(context, radius) { 
      const x = Math.random() * WIDTH;
      const y = Math.random() * HEIGHT;
      const fillColor = randamColor();
      context.fillStyle = fillColor;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    function draw( context, count = 500, radius = 10 ) { 
      for (let i = 0; i < count; i++) {
        drawCircle(context, radius);
      }
    }

    requestAnimationFrame(function update() { 
      ctx?.clearRect( 0, 0, WIDTH,HEIGHT )
      draw(ctx);
      requestAnimationFrame(update)
    })

  };

  return (
    <div className={styles.main}>
      <canvas width={1200} height={600} />
    </div>
  );
};

export default Performance;
