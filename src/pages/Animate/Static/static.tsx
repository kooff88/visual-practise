import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import classNames from 'classnames';
import { Animator } from '../common/';
import styles from './index.less';

const Static: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 渲染图
  const showPic = () => {
    // const block = document.querySelector('#block');
    // let rotation = 0;

    // requestAnimationFrame(function update() {
    //   block.style.transform = `rotate(${rotation++}deg)`;
    //   requestAnimationFrame(update);
    // });

    // 时序
    // const block = document.querySelector('#block');
    // const startAngle = 0;
    // const T = 2000;
    // let startTime = null;
    // function update() {
    //   startTime = startTime == null ? Date.now() : startTime;
    //   const p = (Date.now() - startTime) / T;
    //   const angle = startAngle + p * 360;
    //   block.style.transform = `rotate(${angle}deg)`;
    //   requestAnimationFrame(update);
    // }
    // update();

    const blocks = document.querySelectorAll('.block');
    const animator = new Animator({ duration: 1000, iterations: 1 });
    (async function () {
      let i = 0;
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        await animator.animate(blocks[i++ % 4], ({ target, timing }) => {
          target.style.transform = `rotate(${timing.p * 360}deg)`;
        });
      }
    })();
  };

  return (
    <div className={styles.main}>
      <div className={styles.bird}></div>
      <div className={styles.container}>
        <div className={classNames('block', styles.block)}></div>
        <div className={classNames('block', styles.block)}></div>
        <div className={classNames('block', styles.block)}></div>
        <div className={classNames('block', styles.block)}></div>
      </div>
    </div>
  );
};

export default Static;
