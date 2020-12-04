import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import styles from './index.less';
import { groupBy } from 'lodash/groupBy';



const D3SimplePointsChart: React.FC<{}> = (props) => {
  let { points } = props;

    useEffect(() => {
        drawMap()
    }, []);

    const drawMap = () => {
      const container = document.getElementById("containerSPC")
      const containerWidth = container.parentElement.offsetWidth
      const margin = { top: 80, right: 80, bottom: 30, left: 60 }

      const width = containerWidth - margin.left - margin.right
      const height = 600 - margin.top - margin.bottom

      let chart = d3
        .select(container)
        .attr("width", width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

      let x = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(points, d=> d[0])
        ])
        .range([0, width])
      
      let y = d3
        .scaleLinear()
        .rangeRound([0, height]) // 输出值会四舍五入，结果为整数
        .domain([
          d3.max(points, d => d[1]),
          0
        ])
      
      let z = d3.scaleOrdinal(d3.schemeCategory10);

      let g = chart
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
      
      let tip = d3Tip()
        .attr("class", 'd3-tip')
        .offset([-10, 0])
        .html(d => { 

          d = d.target.__data__
        
          return (
            "<strong>运动年限:</strong><span style='color:#ffeb3b'> " +
            d[0] +
            " </span><br><strong>健康指数:</strong><span style='color:#ffeb3b'> " +
            d[1] +
            ' </span>'
          )
        })
      
      chart.call(tip)

      g.append("g")  // 设置X轴
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width)
        .attr("y", 20)
        .attr("dy", '0.0em')
        .attr("dx", '1.0em')
        .style("text-anchor", 'end')
        .style("fill", '#000')
        .style("font-size",20)
        .text("激烈运动年限 (年)")
      
      g.append("g") // 设置y轴
        .attr("class", 'axis axis--y')
        .call(d3.axisLeft(y))
        .append("text")
        .attr("y", -16)
        .attr('dy', '.71em')
        .style('text-anchor', 'start')
        .style('fill', '#000')
        .style("font-size",20)
        .text('健康指数 (分)')
      
   let a =    g.append("g") //输出点
        .selectAll("circle")
        .attr("class", "points")
        .data(points)
        .enter()
        .append("circle")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .attr("fill", d => z(d[1]))
        .attr("cx",d => x(d[0]))
        .attr("cy",d => y(d[1]))
        .attr("r", 0)
        .transition()
        .duration(750)
        .delay((d, i) => i * 10)
        .attr("r", 20)

      chart
        .append("g")
        .attr("class", "chart--title")
        .append("text")
        .attr("fill", "#000")
        .attr("font-size", "16px")
        .attr("font-weight", "700")
        .attr("text-anchor", "middle")
        .attr("x", containerWidth / 2)
        .attr("y", 20)
        .text('[模拟]激烈运动年限与健康指数之间的关系抽样检查')
        

               
        chart.call(d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([1, 8])
        .on("zoom", zoomed));
      
        function zoomed(obj) {
          console.log("obj==<>", obj);
          // g.attr("transform", d3.event.transform);
          g.attr("transform",  obj.transform);
        }
      
      
    }

    return (
        <div className={styles.main}>
            <svg id="containerSPC"/>
        </div>
    );
}

export default D3SimplePointsChart;
