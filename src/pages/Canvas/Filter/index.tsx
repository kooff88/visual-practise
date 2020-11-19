import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { loadImage, getImageData, traverse, gaussianBlur, getPixel } from './lib/util.js';
import {
  grayscale,
  brightness,
  saturate,
  contrast,
  invert,
  sepia,
  hueRotate,
  channel,
  transformColor,
  multiply,
} from './lib/colorMatrix.js';
import styles from './index.less';
import sunShine from '@/assets/1.jpg';

const Filter: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.getElementById('paper');
    const context = canvas.getContext('2d');

    (async function () {
      // 异步加载图片
      const img = await loadImage('https://p2.ssl.qhimg.com/d/inn/4b7e384c55dc/girl1.jpg');

      const sunlight = await loadImage(sunShine);
      // 获取图片的 imageData 数据对象
      const imageData = getImageData(img);
      const texture = getImageData(sunlight);
      console.log('texturetexture', texture);
      // 遍历 imageData 数据对象
      // traverse(imageData, ({ r, g, b, a }) => {
      //   // 对每个像素进行灰度化处理
      //   const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      //   return [v, v, v, a];
      // });

      // // 增强红色通道，减弱绿色通道
      // traverse(imageData, ({ r, g, b, a }) => {
      //   return transformColor([r, g, b, a], channel({ r: 1.5, g: 0.75 }));
      // });

      // // 增强红色通道，减弱绿色通道
      // traverse(imageData, ({ r, g, b, a }) => {
      //   return transformColor([r, g, b, a], hueRotate(45));
      // });

      // gaussianBlur(imageData.data, imageData.width, imageData.height, 4);
      // traverse(imageData, ({ r, g, b, a }) => {
      //   return transformColor(
      //     [r, g, b, a],
      //     grayscale(0.5),
      //     saturate(1.2),
      //     contrast(1.1),
      //     brightness(1.2),
      //   );
      // });
      // traverse(imageData, ({ r, g, b, a, x, y }) => {
      //   const d = Math.hypot(x - 0.5, y - 0.5);
      //   a *= 1.0 - 2 * d;
      //   return [r, g, b, a];
      // });

      traverse(imageData, ({ r, g, b, a, index }) => {
        const texColor = getPixel(texture, index);
        return transformColor(
          [r, g, b, a],
          brightness(1 + 0.7 * texColor[3]),
          saturate(2 - texColor[3]),
        );
      });

      // 更新canvas内容
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);
    })();
  };

  return (
    <div className={styles.main}>
      <canvas id="paper" className={styles.canv} width={1200} height={600} />
    </div>
  );
};

export default Filter;
