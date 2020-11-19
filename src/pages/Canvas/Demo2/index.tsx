import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { cubehelix } from 'cubehelix';
import styles from './index.less';

const Demo2: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    ctx.translate(256, 256);
    ctx.scale(1, -1);

    const color = cubehelix(); // 构造cubehelix色盘颜色映射函数
    const T = 2000;

    function update(t) {
      const p = 0.5 + 0.5 * Math.sin(t / T);
      ctx.clearRect(0, -256, 512, 512);
      const { r, g, b } = color(p);
      ctx.fillStyle = `rgb(${255 * r},${255 * g},${255 * b})`;
      ctx.beginPath();
      ctx.rect(20, -20, 480 * p, 40);
      ctx.fill();
      window.ctx = ctx;
      requestAnimationFrame(update);
    }
    update(0);
  };

  return (
    <div className={styles.main}>
      <canvas width={1200} height={600} />
    </div>
  );
};

export default Demo2;
