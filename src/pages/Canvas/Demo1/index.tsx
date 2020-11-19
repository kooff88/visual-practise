import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Vec3 } from '../../common/math/vec3';
import * as d3 from 'd3';
import styles from './index.less';

const Demo1: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    ctx.translate(256, 256);
    ctx.scale(1, -1);

    // const [h, s, l] = randomColor();
    // for (let i = 0; i < 3; i++) {
    //   const p = (i * 0.25 + h) % 1;
    //   for (let j = 0; j < 5; j++) {
    //     const d = j - 2;
    //     ctx.fillStyle = `hsl(${Math.floor(p * 360)}, ${Math.floor(
    //       (0.15 * d + s) * 100,
    //     )}%, ${Math.floor((0.12 * d + l) * 100)}%)`;
    //     ctx.beginPath();
    //     ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2);
    //     ctx.fill();
    //   }
    // }

    // for (let i = 0; i < 20; i++) {
    //   ctx.fillStyle = `hsl(${Math.floor(i * 15)}, 50%, 50%)`;
    //   ctx.beginPath();
    //   ctx.arc((i - 10) * 20, 60, 10, 0, Math.PI * 2);
    //   ctx.fill();
    // }
    // for (let i = 0; i < 20; i++) {
    //   ctx.fillStyle = `hsl(${Math.floor((i % 2 ? 60 : 210) + 3 * i)}, 50%, 50%)`;
    //   ctx.beginPath();
    //   ctx.arc((i - 10) * 20, -60, 10, 0, Math.PI * 2);
    //   ctx.fill();
    // }

    /* global d3 */
    for (let i = 0; i < 20; i++) {
      const c = d3.lab(30, i * 15 - 150, i * 15 - 150).rgb();
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.beginPath();
      ctx.arc((i - 10) * 20, 60, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 20; i++) {
      const c = d3.lab(i * 5, 80, 80).rgb();
      ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
      ctx.beginPath();
      ctx.arc((i - 10) * 20, -60, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // RGBA 实现
    // for (let i = 0; i < 3; i++) {
    //   const colorVector = randomRGB();
    //   for (let j = 0; j < 5; j++) {
    //     const c = colorVector.clone().scale(0.5 + 0.25 * j);
    //     ctx.fillStyle = `rgb(${Math.floor(c[0] * 256)}, ${Math.floor(c[1] * 256)}, ${Math.floor(
    //       c[2] * 256,
    //     )})`;
    //     ctx.beginPath();
    //     ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2);
    //     ctx.fill();
    //   }
    // }
  };

  const randomColor = () => {
    return new Vec3(
      0.5 * Math.random(), // 初始色相随机取0~0.5之间的值
      0.7, // 初始饱和度0.7
      0.45, // 初始亮度 0.45
    );
  };

  const randomRGB = () => {
    return new Vec3(0.5 * Math.random(), 0.5 * Math.random(), 0.5 * Math.random());
  };

  return (
    <div className={styles.main}>
      <canvas width={600} height={600} />
    </div>
  );
};

export default Demo1;
