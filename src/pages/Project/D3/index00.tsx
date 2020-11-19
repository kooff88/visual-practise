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
      height: 900,
      mode: 'stickyWidth',
    });

    const layer = scene.layer('fglayer', {
      handleEvent: false,
      autoRender: false,
    });

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))   // 节点连线
      .force('charge', d3.forceManyBody()) // 多实例作用
      .force('center', d3.forceCenter(400, 300)); // 力中心

    d3.json('https://s0.ssl.qhres.com/static/f74a79ccf53d8147.json').then(graph => {
      function ticked() {
        d3.select(layer).selectAll('path')
          .attr('d', (d) => {
            const [sx, sy] = [d.source.x, d.source.y];
            const [tx, ty] = [d.target.x, d.target.y];
            return `M${sx} ${sy} L ${tx} ${ty}`;
          })
          .attr('strokeColor', 'white')
          .attr('lineWidth', 1);
        d3.select(layer).selectAll('sprite')
          .attr('pos', (d) => {
            return [d.x, d.y];
          });
        layer.render();
      }

      simulation
        .nodes(graph.nodes)
        .on('tick', ticked);

      simulation.force('link')
        .links(graph.links);

      // draw spots
      // ! due to d3 rules, you have to set attributes seperatly
      d3.select(layer).selectAll('sprite')
        .data(graph.nodes)
        .enter()
        .append('sprite')
        .attr('pos', (d) => {
          return [d.x, d.y];
        })
        .attr('size', [10, 10])
        .attr('border', [1, 'white'])
        .attr('borderRadius', 5)
        .attr('anchor', 0.5);

      // draw lines
      d3.select(layer).selectAll('path')
        .data(graph.links)
        .enter()
        .append('path')
        .attr('d', (d) => {
          const [sx, sy] = [d.source.x, d.source.y];
          const [tx, ty] = [d.target.x, d.target.y];
          return `M${sx} ${sy} L ${tx} ${ty}`;
        })
        .attr('name', (d, index) => {
          return `path${index}`;
        })
        .attr('strokeColor', 'white');

      d3.select(layer.canvas)
        .call(d3.drag()
          .container(layer.canvas)
          .subject(dragsubject)
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      function dragsubject() {
        const [x, y] = layer.toLocalPos(event.x, event.y);
        return simulation.find(x, y);
      }
    });

    function dragstarted(event) {
      if(!event.active) simulation.alphaTarget(0.3).restart();

      const [x, y] = [event.subject.x, event.subject.y];
      event.subject.fx0 = x;
      event.subject.fy0 = y;
      event.subject.fx = x;
      event.subject.fy = y;

      const [x0, y0] = layer.toLocalPos(event.x, event.y);
      event.subject.x0 = x0;
      event.subject.y0 = y0;
    }

    function dragged(event) {
      const [x, y] = layer.toLocalPos(event.x, event.y),
        {x0, y0, fx0, fy0} = event.subject;
      const [dx, dy] = [x - x0, y - y0];

      event.subject.fx = fx0 + dx;
      event.subject.fy = fy0 + dy;
    }

    function dragended(event) {
      if(!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  };

  return (
    <div id="stage" className={styles.stage}  style={{ height:1200,width:900 }}></div>
  );
};

export default D323;
