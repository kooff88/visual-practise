import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import styles from './index.less';
import { groupBy } from 'lodash/groupBy';



const D3SimplePackChart: React.FC<{}> = (props) => {
  let { data } = props;

    useEffect(() => {
        drawMap()
    }, []);

  const drawMap = () => {
    const container = document.getElementById("containerSPC")
    const containerWidth = container.parentElement.offsetWidth
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }

    const width = containerWidth - margin.left - margin.right
    const height = 1500 - margin.top - margin.bottom

    let chart = d3
      .select(container)
      .attr("width", width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    let g = chart
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    let z = d3.scaleOrdinal(d3.schemeCategory10);

      
    //数据分成
    let root = d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
      
    let pack = d3
      .pack()  // 构建打包图
      .size([width - 2, height - 2])
      .padding(3)
      
    pack(root)

    let node = g
      .selectAll("g") // 定位到所有圆的中点，画g
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .attr("class", d => `node(${!d.children ? ' node--leaf' : d.depth ? '' : ' node--root'})`)
      .style("cursor", "pointer")
      .style("fill-opacity", "0.8")
      .each(d => d.node = this)
      // .on("mouseover", hovered(true,this))
      // .on("mouseout",  hovered(false,this))

    node
      .append("circle") // 画圈圈
      .attr("id", d => { 
        return (
          'r' +
          Math.floor(d.r) +
          '-x' +
          Math.floor(d.x) +
          '-y' +
          Math.floor(d.y)
        )
      })
      .style('fill', d => z(d.depth))
      .attr("r", 0)
      .transition()
      .duration(50)
      .delay((d, i) => i * 50)
      .attr("r", d => d.r)
    
    let leaf = node.filter(d => !d.children); // 筛选叶

    leaf
      .append("clipPath") // 增加这招防止文字超出圆圈
      .attr("id", d => { 
        return (
          'clip-r' +
          Math.floor(d.r) +
          '-x' +
          Math.floor(d.x) +
          '-y' +
          Math.floor(d.y)
        )
      })
      .append("use") // 大小引用圈圈的大小
      .attr("xlink:href", d => { 
        return (
          '#r' +
          Math.floor(d.r) +
          '-x' +
          Math.floor(d.x) +
          '-y' +
          Math.floor(d.y)
        )
      })
    
    leaf
      .append("text") //  输出叶子文字
      .attr("clip-path", d => { 
        return (
          'url(#clip-r' +
          Math.floor(d.r) +
          '-x' +
          Math.floor(d.x) +
          '-y' +
          Math.floor(d.y) +
          ')'
        )
      })
      .selectAll("tspan")
      .data(d => d.data.name)
      .enter()
      .append("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => 13 + (i - nodes.length / 2 - 0.5) * 12)
      .text(d => d)
    
    node
      .append("title")  // 输出title,mouseover显示
      .text(function(d) {
        return d.data.name + '\n' + d.value + '平方千米'
      })
    
    let notLeaf = node.filter(d => d.depth === 1) // 筛选一线城市

    notLeaf
      .append("text") // 输出四大城市名字d
      .selectAll("tspan")
      .data(d => d.data.name)
      .enter()
      .append("tspan")
      .style("fill", "#fff")
      .style("font-size", '42px')
      .attr("x", 0)
      .attr('y', function(d, i, nodes) {
        return 70 + (i - nodes.length / 2 - 0.5) * 70
      })
      .text(function(d) {
        return d
      })

      
    function hovered(hover,d) { 
        console.log('d',d)
        // 把所有老祖宗都圈线
        return function () { 
          d3.selectAll(
            d.ancestors().map(d => d.node)
          ).classed("node--hover",hover)
        }
      }
      
    }

    return (
        <div className={styles.main}>
            <svg id="containerSPC"/>
        </div>
    );
}

export default D3SimplePackChart;
