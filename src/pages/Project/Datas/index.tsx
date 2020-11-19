import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from './d3v6.js';
import { Scene, Sprite, Polyline, SpriteSvg } from 'spritejs';
import  { Chart, Pie, Legend, Tooltip, theme} from  '@qcharts/core';
import dataJson from "./data.json";  
import styles from './index.less';


console.log('d3333',d3)
const Datas: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = () => {

    const canvas = document.querySelector('canvas');
    const {width, height} = canvas;

    function draw(data, filter = null) { 
      if (filter) data = data.filter(filter);
      const context = canvas.getContext('2d');
      for (let i = 0; i < data.length; i++) { 
        const { x, y, gender } = data[i];
        context.fillStyle = gender === 'f' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
        
        context?.beginPath();
        
        const spot = context.arc(x, y, 10, 0, Math.PI * 2);
        context?.fill();
      }
    }

    const data = dataJson;
    console.log(data);
    draw(data, ({ time }) => time === 20);

  };

  return (
    <div className={styles.main} id="container">
      <div className={styles.box}>
        <div >广场</div>
        <div >休闲区</div>
        <div >游乐场</div>
        <div >花园</div>
      </div>
      <canvas width="600" height="600"></canvas>
    </div>
  );
};

export default Datas;
