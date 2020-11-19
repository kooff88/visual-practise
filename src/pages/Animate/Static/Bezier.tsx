import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import classNames from 'classnames';
import BezierEasing from 'bezier-easing';
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

    const block = document.querySelector('.block');
    // const animator = new Animator({ duration: 3000, easing: (p) => p ** 2 });
    const animator = new Animator({ duration: 3000, easing: BezierEasing(0.5, -1.5, 0.5, 2.5) }); // 贝塞尔缓动

    // document.addEventListener('click', () => {
    //   animator.animate(
    //     { el: block, start: 100, end: 400 },
    //     ({ target: { el, start, end }, timing: { p } }) => {
    //       const left = start * (1 - p) + end * p;
    //       el.style.left = `${left}px`;
    //     },
    //   );
    // });
  };

  return (
    <div className={styles.main}>
      <div className={styles.bird}></div>
      <div className={styles.container}>
        <div className={classNames({ [styles.animate]: true }, styles.block)}></div>
      </div>
    </div>
  );
};

export default Static;
