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
    console.log(data);

    function count(d, dataset) { 
      let place;
      if(d.x < 300 && d.y < 300) {
        place = 'square';
      } else if (d.x >= 300 && d.y < 300) {
        place = 'sections';
      } else if (d.x >= 300 && d.y >= 300) {
        place = 'garden';
      } else {
        place = 'playground';
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

      if ( d.gender === 'f' ) { 
        dataset[place][0].people++;
      }else {
        dataset[place][1].people++;
      }

      return dataset;
    }

    function groupData(data) {
      const dataset = {};

      for(let i = 0; i < data.length; i++) {
        const d = data[i];
        
        if(d.time === 12) {
          const p = count(d, dataset);
        }
      }

      return dataset;
    }

    const dataset = [];

    Object.entries(groupData(data)).forEach(([place, d]) => { 
      d[0].place = `${place}: 男`;
      d[1].place = `${place}: 女`;
      dataset.push(...d);
    })

    console.log(dataset);
    const chart = new Chart({
      container: `#container`
    });

    chart.source(dataset, {
      row: 'place',
      value: 'people'
    });

    const ds = chart.dataset;

    const pie = new Pie({
      radius: 0.4,
      pos: [0, 0]
    }).source(ds.selectRows(dataset.filter(d => d.gender === '女游客').map(d => d.place)));

    const pie2 = new Pie({
      innerRadius: 0.5,
      radius: 0.7
    }).source(ds.selectRows(dataset.filter(d => d.gender === '男游客').map(d => d.place)));

    const legend = new Legend({ orient: 'vertical', align: ['right', 'center'] });

    chart.append([pie2, pie, legend]);
  };

  return (
    <div className={styles.main} id="container">

    </div>
  );
};

export default Datas;
