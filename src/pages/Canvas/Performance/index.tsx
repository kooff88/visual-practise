import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Renderer, Program, Geometry, Transform, Mesh } from 'ogl';
import randomWorker from "./random_shapes_worker.js"
import styles from './index.less';

const Performance: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 展示图片
  const showPic = () => {
    const canvas = document.querySelector('canvas');

    const worker = new Worker(randomWorker);
    const ofc = canvas.transferControlToOffscreen();
    worker.postMessage({
      canvas: ofc,
      type: 'init',
    }, [ofc]);
      
  };

  return (
    <div className={styles.main}>
        <canvas width="600" height="600"></canvas>
    </div>
  );
};

export default Performance;
