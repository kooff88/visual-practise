import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import styles from './index.less';

const Grid: React.FC<{}> = (props) => {
  useEffect(() => {
    // showPic();
  }, []);

  // 展示图片
  const showPic = () => {};

  return (
    <div className={styles.main}>
      <canvas className={styles.canv} width={1200} height={600} />
    </div>
  );
};

export default Grid;
