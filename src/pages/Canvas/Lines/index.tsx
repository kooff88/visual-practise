import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { cubehelix } from 'cubehelix';
import styles from './index.less';

const Lines: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const points = [
      [100, 100],
      [100, 200],
      [200, 150],
      [300, 200],
      [300, 100],
    ];

    ctx.strokeStyle = 'red';
    drawPolyline(ctx, points, {
      lineWidth: 10,
      lineCap: 'round',
      lineJoin: 'miter',
      miterLimit: 1.5,
    });
    ctx.strokeStyle = 'blue';
    drawPolyline(ctx, points);
  };

  function drawPolyline(
    context,
    points,
    { lineWidth = 1, lineJoin = 'miter', lineCap = 'butt', miterLimit = 10 } = {},
  ) {
    context.lineWidth = lineWidth;
    context.lineJoin = lineJoin;
    context.lineCap = lineCap;
    context.miterLimit = miterLimit;
    context.beginPath();
    context.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(...points[i]);
    }
    context.stroke();
  }

  return (
    <div className={styles.main}>
      <canvas width={1200} height={600} />
    </div>
  );
};

export default Lines;
