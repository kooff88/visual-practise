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

  const showPic = async () => {
    const data = beijing_2014_dt.filter(d => new Date(d.Date).getMonth() < 3);
    console.log(data);
    const dataset1 = data
      .map(d => {
        return {
          value: Number(d['Temperature(Celsius)(avg)']),
          date: d.Date,
          category: '平均气温'}
        });
    const dataset2 = data
      .map(d => {
          return {
            value: Number(d['Humidity(%)(avg)']),
            date: d.Date,
            category: '平均湿度'}
          });
    console.log(dataset2);
    const chart = new Chart({
      container: '#app'
    });
    let clientRect={bottom:50};
    chart.source([...dataset1, ...dataset2], {
      row: 'category',
      value: 'value',
      text: 'date'
    });

    const line = new Line({clientRect});
    const axisBottom = new Axis({ clientRect, layer: 'default' })
    .style('grid', false)
    .style('scale', function (attr, data, i) {
      if (i % 10 !== 0) {
        return false
      }
    })
    .style('label', function (attr, data, i) {
      if (i % 10 !== 0) {
        return false
      }
    });
    const toolTip = new Tooltip({
      title: arr => {
        return arr.category
      }
    });
    const legend = new Legend();
    const axisLeft = new Axis({ orient: 'left',clientRect }).style('axis', false).style('scale', false);

    chart.append([line, axisBottom, axisLeft, toolTip, legend]);


  };

  return (
    <div className={styles.container} >
      <div className={styles.main} id="app"></div>
    </div>
  );
};

export default DataDemo1;
