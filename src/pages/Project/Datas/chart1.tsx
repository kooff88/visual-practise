import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from './d3v6.js';
import { Scene, Sprite, Polyline, SpriteSvg } from 'spritejs';
import dataJson from "./data.json";  
import styles from './index.less';


console.log('d3333',d3)
const Datas: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = () => {
    const data = dataJson;
    const dataset = d3.rollups(data, v => v.length, d => d.time).sort(([a], [b]) => a - b);
    dataset.unshift([6, 0]);
    dataset.push([22, 0]);

    console.log(dataset);
    const scene = new Scene({
      container,
      width: 600,
      height: 600,
      displayRatio: 2,
    })
    const fglayer = scene.layer('fglayer');

    const points = [];

    dataset.forEach((d, i) => { 
      const x = 20 + 20 * d[0];
      const y = 300 - d[1];
      points.push(x, y);
    })

    const p = new Polyline();

    p.attr({
      points,
      lineWidth: 4,
      strokeColor: 'green',
      smooth: true,
    })

    fglayer.append(p);

    const scale = d3.scaleLinear()
      .domain([0, 24])
      .range([0, 480]);
    
    const axis = d3.axisBottom(scale)
      .tickValues(dataset.map(d => d[0]));

    const axisNode = new SpriteSvg({
      x: 20,
      y: 300,
      flexible: true,
    });

    d3.select(axisNode.svg)
      .attr('width', 600)
      .attr('height', 60)
      .append('g')
      .call(axis);
    
    axisNode.svg.children[0].setAttribute('font-size', 20);
    fglayer.append(axisNode);
    
  };

  return (
    <div className={styles.main} id="container"></div>
  );
};

export default Datas;
