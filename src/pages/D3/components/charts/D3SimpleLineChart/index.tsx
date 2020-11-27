import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import styles from './index.less';
import { groupBy } from 'lodash/groupBy';



const D3SimpleLineChart: React.FC<{}> = (props) => {
  let { data } = props;

    useEffect(() => {
        drawMap()
    }, []);

    const drawMap = () => {
      const container = document.getElementById("containerSLC")
      const containerWidth = container.parentElement.offsetWidth
      const margin = { top: 80, right: 80, bottom: 30, left: 60 }

      const width = containerWidth - margin.left - margin.right
      const height = 800 - margin.top - margin.bottom
      const labelPadding = 3;

      let chart = d3
        .select(container)
        .attr("width", width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

      let g = chart
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
      
      

      let x = d3
        .scaleBand()
        .domain(d3.map(data, d => d.date))
        .range([margin.left, width - margin.right])
      
      let y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])
      
      let line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))
      
      
      chart.append("g").call(xAxis)
      chart.append("g").call(yAxis)
      
      chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
      
      function xAxis(g) { 
        g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call( d3.axisBottom(x).ticks( width / 80).tickSizeOuter(0))
      }

      function yAxis(g) { 
        g.attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y))
          .call(g => g.select('.domain').remove())
          .call(g => g.select('.tick:last-of-type text').clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y)
        )
      }
      
      
    }

    return (
        <div className={styles.main}>
            <svg id="containerSLC"/>
        </div>
    );
}

export default D3SimpleLineChart;
