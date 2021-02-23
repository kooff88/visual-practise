import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import styles from './index.less';
import { color } from 'highcharts';



const D3StackedBarChart: React.FC<{}> = (props) => {
  
  const data = [
     {name: "<5", value: 0.0629101833369229, startValue: 0, endValue: 0.0629101833369229},
    {name: "5-9", value: 0.064774120151473, startValue: 0.0629101833369229, endValue: 0.1276843034883959},
    {name: "10-14", value: 0.06533587548124611, startValue: 0.1276843034883959, endValue: 0.19302017896964202},
    {name: "15-19", value: 0.06746751207109378, startValue: 0.19302017896964202, endValue: 0.26048769104073577},
    {name: "20-24", value: 0.0714159850252415, startValue: 0.26048769104073577, endValue: 0.3319036760659773},
    {name: "25-29", value: 0.06855286024482231, startValue: 0.3319036760659773, endValue: 0.4004565363107996},
    {name: "30-34", value: 0.06692775253784874, startValue: 0.4004565363107996, endValue: 0.46738428884864835},
    {name: "35-39", value: 0.06273251088453081, startValue: 0.46738428884864835, endValue: 0.5301167997331792},
    {name: "40-44", value: 0.06570344729389636, startValue: 0.5301167997331792, endValue: 0.5958202470270755},
    {name: "45-49", value: 0.06751770558149908, startValue: 0.5958202470270755, endValue: 0.6633379526085746},
    {name: "50-54", value: 0.07116720694276307, startValue: 0.6633379526085746, endValue: 0.7345051595513377},
    {name: "55-59", value: 0.06635371343087063, startValue: 0.7345051595513377, endValue: 0.8008588729822084},
    {name: "60-64", value: 0.058182644671388284, startValue: 0.8008588729822084, endValue: 0.8590415176535966},
    {name: "65-69", value: 0.04596131315992109, startValue: 0.8590415176535966, endValue: 0.9050028308135177},
    {name: "70-74", value: 0.03345092743639488, startValue: 0.9050028308135177, endValue: 0.9384537582499126},
    {name: "75-79", value: 0.02442262921859876, startValue: 0.9384537582499126, endValue: 0.9628763874685113},
    {name: "80-84", value: 0.018360673631347184, startValue: 0.9628763874685113, endValue: 0.9812370610998585},
    {name: "≥85", value: 0.01876293890014149, startValue: 0.9812370610998585, endValue: 1},
  ]


  const [currentData, setCurrentData] = useState<unknown>({})

    useEffect(() => {
        drawMap()
    }, []);

  const drawMap = () => {
    const container = document.getElementById("D3StBC")
    const containerWidth = container.parentElement.offsetWidth
    const margin = { top: 0, right: 0, bottom: 0, left: 0 }

    const width = containerWidth - margin.left - margin.right
    const height = 33

    let chart = d3.select(container)
        .attr("viewBox", [0, 0, width, height])
        .style("display", "block");

    
    let color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
    
    let x = d3.scaleLinear([0,1], [ margin.left, width - margin.right])
    
    let formatPercent = x.tickFormat(null, '%');
    
  
    chart.append("g")
    .attr("stroke", "white")
    .selectAll("rect")
    .data(stack)
    .join("rect")
      .attr("fill", d => color(d.name)) 
      .attr("x", d => x(d.startValue))
      .attr("y", margin.top)
      .attr("width", d => x(d.endValue) - x(d.startValue))
      .attr("height", height - margin.top - margin.bottom)
    .append("title")
      .text(d => `${d.name}
${formatPercent(d.value)}`);
      

    chart.append('g')
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .selectAll("text")
    .data(stack().filter(d => x(d.endValue) - x(d.startValue) > 40))
    .join("text")
    .attr("fill", d => d3.lab(color(d.name)).l < 50 ? "white" : "black")
    .attr("transform", d => `translate(${x(d.startValue) + 6}, 6)`)
    .call(text => text.append("tspan")
        .attr("y", "0.7em")
        .attr("font-weight", "bold")
        .text(d => d.name))
    .call(text => text.append("tspan")
        .attr("x", 0)
        .attr("y", "1.7em")
        .attr("fill-opacity", 0.7)
        .text(d => formatPercent(d.value)));
    

    function stack() { 
      const total = d3.sum(data, d => d.value);
      let value = 0;
      return  data.map(d => ({
        name: d.name,
        value: d.value / total,
        startValue: value / total,
        endValue: (value += d.value) / total
      }))
    }

  }

  return (
      <div className={styles.main}>
          <svg id="D3StBC"/>
      </div>
  );
}

export default D3StackedBarChart;

