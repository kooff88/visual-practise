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

  // const animator = new Animator({ duration: 3000, easing: (p) => p ** 2 });

  // 渲染图
  const showPic = () => {
    const block = document.querySelector('.block');

    async function run_animator() {
      let _duration = 400;
      const start_pos = 100;
      const end_pos = 300;
      let h = end_pos - start_pos;

      const animator = new Animator({ duration: _duration, easing: (p) => p ** 2 });
      await animator.animate(
        { el: block, start: start_pos, end: end_pos },
        ({ target: { el, start, end }, timing: { p, isFinished } }) => {
          const top = start * (1 - p) + end * p;
          el.style.top = `${top}px`;
        },
      );

      while (h > 2) {
        h /= 2;
        const top = end_pos - h;
        _duration /= Math.sqrt(2);
        // console.log(`${h} ${_duration}`)
        const animator_up = new Animator({ duration: _duration, easing: (p) => p * (2 - p) });
        const animator_down = new Animator({ duration: _duration, easing: (p) => p ** 2 });

        await animator_up.animate(
          { el: block, start: end_pos, end: top },
          ({ target: { el, start, end }, timing: { p, isFinished } }) => {
            const top = start * (1 - p) + end * p;
            el.style.top = `${top}px`;
          },
        );

        await animator_down.animate(
          { el: block, start: top, end: end_pos },
          ({ target: { el, start, end }, timing: { p, isFinished } }) => {
            const top = start * (1 - p) + end * p;
            el.style.top = `${top}px`;
          },
        );
      }
    }
    run_animator();
  };

  return (
    <div className={styles.main}>
      <div className={styles.bird}></div>
      <div className={styles.container}>
        <div className={classNames('block', styles.block)}></div>
      </div>
    </div>
  );
};

export default Static;
