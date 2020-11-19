import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "../DataDemo1/d3v6.js";
// import * as d3 from "d3";
import { Scene,  SpriteSvg } from 'spritejs';
import styles from './index.less';


const D323: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = async () => {
    const container = document.getElementById('stage');
    const scene = new Scene({
      container,
      width: 1200,
      height: 1200,
    });

    const dataset = [125, 121, 127, 193, 309];

    const scale = d3.scaleLinear()
      .domain([100, d3.max(dataset)])
      .range([0, 500]);

    const fglayer = scene.layer('fglayer');
    const s = d3.select(fglayer);

    const colors = ['#fe645b', '#feb050', '#c2af87', '#81b848', '#55abf8'];
    const chart = s.selectAll('sprite')
      .data(dataset)
      .enter()
      .append('sprite')
      .attr('x', 450)
      .attr('y', (d, i) => {
        return 200 + i * 95;
      })
      .attr('width', scale)
      .attr('height', 80)
      .attr('bgcolor', (d, i) => {
        return colors[i];
      });
    
    const axis = d3.axisBottom(scale).tickValues([100, 200, 300]);
    const axisNode = new SpriteSvg({
      x: 420,
      y: 680,
    });
    d3.select(axisNode.svg)
      .attr('width', 600)
      .attr('height', 60)
      .append('g')
      .attr('transform', 'translate(30, 0)')
      .call(axis);

    axisNode.svg.children[0].setAttribute('font-size', 20);
    fglayer.append(axisNode);

  };

  return (
    <div id="stage"  style={{ height:1200,width:1200 }}></div>
  );
};

export default D323;
