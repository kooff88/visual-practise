import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import  * as d3 from "d3"
import styles from './index.less';



const SimplePackChartII: React.FC<{}> = (props) => {

  


  const data = {
    name: '1',
    children: [
      {
        name: '1-1',
        children: [
          { name: '1-1-1',  value: 10 },
          { name: '1-1-2', value: 20 },
          { name: '1-1-3', value: 30 }
        ]
      },
      {
        name: '1-2',
        children: [
          { name: '1-2-1',  value: 40 },
          { name: '1-2-2', value: 50 }
        ]
      },
      {
        name: '1-3',
        value: 60
      }
    ]
  };


  useEffect(() => { 
    showPic()
  },[])


  const showPic = () => {
    const container = document.getElementById("packChart")
    const containerWidth = container.parentElement.offsetWidth

    const width = containerWidth;
    const height = width;

    let root = pack(data)

    console.log('root',root)
    let chart = d3.select(container)
      .attr("width", width )
      .attr('height', height)
      .attr("viewBox", [0, 0, width, height])
    
    let g = chart.append("g")
      .attr("pointer-events", "all")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);
    
    g.append("circle")
      .attr("r", d => d.r)
      .attr("stroke", d => d.children ? "#bbb" : "none")
      .attr("fill", d => d.children ? "none" : "#ddd");
    
    let leaf = g.filter(d => !d.children);
      
    leaf.select("circle")
      .attr("id", d => { 
        d.leafUid = d.data.name
      });


    leaf.append("clipPath")
        .attr("id", d => { 
          d.leafUid = d.data.name
        })
        .append("use")
        .attr("xlink:href", d => d.leafUid.href);

    leaf.append("text")
        .attr("clip-path", d => d.clipUid)
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text(d => d);
        
    g.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}${d.value.toLocaleString()}`);
    
    function pack(data) {
        return d3.pack()
          .size([width, height])
          .padding(3)
          (d3.hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value))
    }    
  }



    return (
        <div className={styles.main}>
          <svg id="packChart" />
        </div>
    );
};

export default SimplePackChartII;
