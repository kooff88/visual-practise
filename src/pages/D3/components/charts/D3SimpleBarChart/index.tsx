import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import styles from './index.less';



const D3SimpleBarChart: React.FC<{}> = (props) => {
    let { data } = props;

    useEffect(() => {
        drawMap()
    }, []);

    const drawMap = () => {
      const container = document.getElementById("containerSBC")
      const containerWidth = container.parentElement.offsetWidth
      const margin = { top: 80, right: 20, bottom: 30, left: 60 }

      const width = containerWidth - margin.left - margin.right
      const height = 500 - margin.top - margin.bottom

      let chart = d3
        .select(container)
        .attr("width", width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      
      let x = d3
        .scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(
          data.map(d => d.letter)
        )  // 设置x轴

      let y = d3
        .scaleLinear()
        .rangeRound([height, 0])
        .domain([
          0,
          d3.max(data, d => d.frequency)
        ])  // 设置y轴
      
      const barWidth = (width / data.length) * 0.9;   // 用于绘制每条柱

      const stepArray = d3.ticks(0, d3.max(data, d => d.frequency), 10); // 用于生成背景柱
      
      const colors = ["#ccc", "#ddd"]; // 用于生成背景柱
      
      let tip = d3Tip()  //设置tip
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => { 
          `
          <strong>星期${d.letter}<br/></strong>
          <span style="color:#ffeb3b">${ (d.frequency * 100).toFixed(2)}%</span>
          `;
        })
      
      chart.call(tip);

      let g = chart
        .append("g") 
        .attr("transform", `translate(${margin.left}, ${margin.top})`)  // 设最外包层在总图上的相对位置
      
      g.append('g')  //设置x轴
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
      
      g.append('g') // 设置 y 轴
        .attr("class", 'axis axis--y')
        .call(d3.axisLeft(y).ticks(10, '%'))
        .append("text")
        .attr("y", -16)
        .attr("dy", '0.71em')
        .style('text-anchor', 'middle')
        .style('fill', '#fff')
        .text("空置率（%）")
      
      g.append("g")  // 设置住背景
        .attr('class', "bar--bg-bar")
        .selectAll('rect')
        .data(d3.range(stepArray.length - 1))
        .attr("stroke", "none")
        .attr("stroke-width", 0)
        .attr("fill", (d, i) => colors[i % 2])
        .attr('x', 1)
        .attr("width", width)
        .attr("height", (d, i) => y(stepArray[i]) - y(stepArray[i + 1]))
        .attr('y', (d, i) => y((i + 1) * stepArray[1]))
      
      g.selectAll('.bar') // 画柱图
        .data(data)
        .enter()
        .append('rect')
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .attr("class", "bar")
        .attr("fill", "#8a2be2")
        .attr("x", d => x(d.letter))
        .attr("y", height)  // 控制动画由下而上
        .attr("width", x.bandwidth())
        .attr("height", 0)  // 控制动画由下而上
        .transition()
        .duration(200)
        .ease(d3.easeBounceInOut)
        .delay((d, i) => i * 200)
        .attr("y", d => y(d.frequency))
        .attr("height", d => height - y(d.frequency))
      
      g.append("g") // 输出柱图上的数值
        .attr("class", "bar--text")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("fill", "orange")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => x(d.letter))
        .attr("y", d => y(d.frequency))
        .attr("dx", barWidth / 2)
        .attr("dy", '5em')
        .text(d => (d.frequency * 100).toFixed(2) + '%')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
      
      chart
        .append('g') // 输出标题
        .attr('class', 'bar--title')
        .append('text')
        .attr('fill', '#000')
        .attr('font-size', '16px')
        .attr('font-weight', '700')
        .attr('text-anchor', 'middle')
        .attr('x', containerWidth / 2)
        .attr('y', 20)
        .text('本周酒店房间空置率')

    }

    return (
        <div className={styles.main}>
            <svg id="containerSBC"/>
        </div>
    );
}

export default D3SimpleBarChart;
