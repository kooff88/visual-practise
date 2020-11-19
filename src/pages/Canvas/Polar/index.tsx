import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import styles from './index.less';
import { parametric } from './parametric';

const Polar: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const w = 0.5 * width,
      h = 0.5 * height;
    ctx.translate(w, h);
    ctx.scale(1, -1);

    drawAxis(ctx, w, h);

    const arc = parametric(
      (t) => 200,
      (t) => t,
      fromPolar,
    );

    arc(0, Math.PI).draw(ctx);

    const rose = parametric(
      (t, a, k) => a * Math.cos(k * t),
      (t) => t,
      fromPolar,
    );

    rose(0, Math.PI, 100, 200, 5).draw(ctx, { strokeStyle: 'blue' });

    const heart = parametric(
      (t, a) => a - a * Math.sin(t),
      (t) => t,
      fromPolar,
    );

    heart(0, 2 * Math.PI, 100, 100).draw(ctx, { strokeStyle: 'red' });

    const foliumRight = parametric(
      (t, a) => Math.sqrt(2 * a ** 2 * Math.cos(2 * t)),
      (t) => t,
      fromPolar,
    );

    const foliumLeft = parametric(
      (t, a) => -Math.sqrt(2 * a ** 2 * Math.cos(2 * t)),
      (t) => t,
      fromPolar,
    );

    foliumRight(-Math.PI / 4, Math.PI / 4, 100, 100).draw(ctx, { strokeStyle: 'green' });
    foliumLeft(-Math.PI / 4, Math.PI / 4, 100, 100).draw(ctx, { strokeStyle: 'green' });
  };

  const fromPolar = (r, theta) => {
    return [r * Math.cos(theta), r * Math.sin(theta)];
  };

  const drawAxis = (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(-w, 0);
    ctx.lineTo(w, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(0, h);
    ctx.stroke();
    ctx.restore();
  };

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={1200} height={600} />
    </div>
  );
};

export default Polar;
