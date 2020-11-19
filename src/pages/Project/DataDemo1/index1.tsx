import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "d3";
// import * as d3 from './d3v6.js';
import { Scene, Sprite, Polyline, SpriteSvg } from 'spritejs';
import  {  Chart, Line, Legend, Tooltip, Axis} from  '@qcharts/core';
import * as beijing_2014_dt from "./beijing_2014.csv";

import styles from './index.less';

console.log('d3333', d3.csvParse)
console.log('beijing_2014',beijing_2014_dt)

const DataDemo1: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic  = async () => {
    const dataset = beijing_2014_dt.filter(d => new Date(d.Date).getMonth() < 3).map(d => { 
      return {
        temperature: Number(d['Temperature(Celsius)(avg)']),
        date: d.Date,
        category:"平均气温"
      }
    })
    console.log('dataset',dataset)

      const chart = new Chart({
        container: '#app'
      });
      let clientRect={bottom:50};
      chart.source(dataset, {
        row: 'category',
        value: 'temperature',
        text: 'date'
      });

      const line = new Line({clientRect});
      const axisBottom = new Axis({clientRect}).style('grid', false);
      axisBottom.attr('formatter', d => '');
      const toolTip = new Tooltip({
        title: arr => {
          return '平均气温'
        }
      });
      const legend = new Legend();
      const axisLeft = new Axis({ orient: 'left',clientRect }).style('axis', false).style('scale', false);

      chart.append([line, axisBottom, axisLeft, toolTip, legend]);


  };

  return (
    <div className={styles.main} id="app">
     
      {/* <canvas id="app" width="600" height="600"></canvas> */}
    </div>
  );
};

export default DataDemo1;
