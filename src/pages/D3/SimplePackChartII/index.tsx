import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import  * as d3 from "d3"
import styles from './index.less';

const athletes = [
  {name: "Floyd Mayweather", sport: "Boxing", nation: "United States", earnings: 285},
  {name: "Lionel Messi", sport: "Soccer", nation: "Argentina", earnings: 111},
  {name: "Cristiano Ronaldo", sport: "Soccer", nation: "Portugal", earnings: 108},
  {name: "Conor McGregor", sport: "MMA", nation: "Ireland", earnings: 99},
  {name: "Neymar", sport: "Soccer", nation: "Brazil", earnings: 90},
  {name: "LeBron James", sport: "Basketball", nation: "United States",  earnings: 85.5},
  {name: "Roger Federer", sport: "Tennis", nation: "Switzerland", earnings: 77.2},
  {name: "Stephen Curry", sport: "Basketball", nation: "United States", earnings: 76.9},
  {name: "Matt Ryan", sport: "Football", nation: "United States", earnings: 67.3},
  {name: "Matthew Stafford", sport: "Football", nation: "United States", earnings: 59.5}
]


const SimplePackChartII: React.FC<{}> = (props) => {

  
  // 数据处理
  const handleData = () => { 
    // let temp = d3.group(athletes, d => d.sport);
    // console.log('Basketball',  temp.get("Basketball"))

    // let temp = d3.group(athletes, d => d.nation, d=> d.sport);
    // console.log('mation', temp.get("United States").get("Boxing"));

    // let temp = d3.rollup(athletes, v => length, d => d.sport);
    let temp = d3.rollup(athletes, v => d3.sum(v, d => d.earnings), d => d.sport );

    console.log('temp', temp)


    // let myMap = new Map([
    //   [101, '123123'],
    //   [102, "231231"],
    //   [103, "asdasd"]
    // ])
    // myMap.set(1000, "牛B");

    // let temp = myMap.get(1000);

    // console.log(temp);
  
  }



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
    handleData()
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
