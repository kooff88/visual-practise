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
    const data = dataJson;
    console.log('data');

    function count(d, dataset) { 
      let place;

      if (d.x < 300 && d.y < 300) {
        place = 'square';
      } else if (d.x >= 300 && d.y < 300) {
        place = "sections";
      } else if (d.x >= 300 && d.y >= 300) {
        place = "garden";
      } else { 
        place = "playground";
      }

      dataset[place] = dataset[place] || [
        {
          gender: '男游客',
          people: 0,
        },
        {
          gender: '女游客',
          people: 0,
        }
      ];

      if (d.gender === 'f') {
        dataset[place][0].people++;
      } else { 
        dataset[place][1].people++;
      }

      return dataset;
    }

    function groundData(data) {
      const dataset = {};

      for(let i = 0; i < data.length; i++) {
        const d = data[i];
        
        if(d.time === 12) {
          const p = count(d, dataset);
        }
      }

      return dataset;
    }

    const dataset = groundData(data);
    console.log(dataset);

    theme.set({
      colors: ['#71dac7', "#d57a77"],
    });

    Object.entries(dataset).forEach(([key, dataset]) => { 
      const chart = new Chart({
        container: `#${key}`
      });
      
      chart.source(dataset, {
        row: "gender",
        value: "people",
        text: "gender"
      });

      const pie = new Pie({
        radius: 0.7,
        animation: {
          duration: 700,
          easing: 'bounceOut'
        }
      });

      const lengend = new Legend({ orient: "vertical", align: ["right", 'center'] });
      const toolTip = new Tooltip();

      chart.append([ pie, lengend, toolTip ]);

    })
  };

  return (
    <div className={styles.main} id="container">
      <div id="square"></div>
      <div id="sections"></div>
      <div id="garden"></div>
      <div id="playground"></div>

    </div>
  );
};

export default Datas;
