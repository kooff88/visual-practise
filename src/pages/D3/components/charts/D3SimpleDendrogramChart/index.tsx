import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import styles from './index.less';



const D3SimpleDendrogramChart: React.FC<{}> = (props) => {
  let { data } = props;

    useEffect(() => {
        drawMap()
    }, []);

    const drawMap = () => {
      const container = document.getElementById("containerSDDC")
      const containerWidth = container.parentElement.offsetWidth
      const margin = { top: 100, right: 250, bottom: 80, left: 200 }

      const width = containerWidth - margin.left - margin.right
      const height = 4000 - margin.top - margin.bottom

      let chart = d3
        .select(container)
        .attr("width", width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

      chart
        .append("defs")
        .append("clipPath")  // 添加长方形方法，遮罩作用
        .attr("id", "clip")
        .append("rect")
        .attr("height", height)
        .attr("width", 0)
        .transition()
        .duration(1000)
        .attr("width", width)
      
      
      let g = chart
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
      
      let z = d3.scaleOrdinal(d3.schemeCategory10) // 通用线条的颜色
      
      let root = d3
        .tree()   //树
        .size([height, width])
        .separation((a, b) => a.parent === b.parent ? 1 : 2)(d3.hierarchy(data))
      
      let linkLine = d3 
        .linkHorizontal()  // 连接线创建器
        .source(d => [d.source.y, d.source.x])
        .target(d => [d.target.y, d.target.x])
      
      g.selectAll('.link') // 创建每条连接线
        .data(root.links())
        .enter()
        .append("path")
        .attr('clip-path', "url(#clip)")
        .attr('class', 'link')
        .style("stroke", "#666")
        .style("stroke-width", 2)
        .attr("fill", "none")
        .attr("d", linkLine)
      
      let node = g
        .selectAll('.node')  // 定位并创建到每个节点
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", d => `node ${d.children ? ' node--internal' : ' node--leaf'}`)
        .attr('transform', d => `translate(${d.y}, ${d.x})`)
      
      node
        .append('circle')  // 画小圆
        .style('fill', d => z(d.depth))
        .style("stroke-width",2)
        .attr('r', 5)
      
      node
        .append('text')  // 输出文字
        .attr("dy", 5)
        .attr("x", d => d.children ? -8 : 8)
        .style('fill', d => z(d.depth))
        .style("font-size", 16)
        .style('text-anchor', function(d) {
          return d.children ? 'end' : 'start'
        })
        .text(function(d) {
          return d.data.name
        })
      
    }

    return (
        <div className={styles.main}>
            <svg id="containerSDDC"/>
        </div>
    );
}

export default D3SimpleDendrogramChart;
