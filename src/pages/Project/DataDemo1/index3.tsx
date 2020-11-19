import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "d3";
// import * as d3 from './d3v6.js';
import { Scene, Sprite, Polyline, SpriteSvg } from 'spritejs';
import  {  Chart, Scatter, Legend, Tooltip, Axis} from  '@qcharts/core';
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
    const dataset = data
    .map(d => {
      return {
        temperature: Number(d['Temperature(Celsius)(avg)']),
        humdity: Number(d['Humidity(%)(avg)']),
        category: '平均气温与湿度'}
      });

  const chart = new Chart({
    container: '#app'
  });
  let clientRect={bottom:50};
  chart.source(dataset, {
    row: 'category',
    value: 'temperature',
    text: 'humdity'
  });

  const scatter = new Scatter({
    clientRect,
    showGuideLine: true,
  });
  const toolTip = new Tooltip({
    title: (data) => '温度与湿度：',
    formatter: (data) => {
      return `温度：${data.temperature}C  湿度：${data.humdity}% `
    }
  });
  const legend = new Legend();
  const axisLeft = new Axis({ orient: 'left',clientRect }).style('axis', false).style('scale', false);
  const axisBottom = new Axis();

  chart.append([scatter, axisBottom, axisLeft, toolTip, legend]);

  };

  return (
    <div className={styles.container} >
      <div className={styles.main} id="app"></div>
    </div>
  );
};

export default DataDemo1;
