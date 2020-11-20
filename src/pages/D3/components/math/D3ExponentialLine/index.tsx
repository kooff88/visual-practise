import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as quarticScaleRadial from "@/utils/d3-quartic-scale-radial"
import { D3ExponentialLineObj } from "./interface";
import styles from './index.less';


const D3ExponentialLine: React.FC<{}> = (props) => {
    let { a } = props;
  // let a = Math.E;
    const [exponentialLine, setExponentialLine] = useState<D3ExponentialLineObj>({
        width: null,
        height: null,
        fy: (x, a = Math.E) => Math.pow(a, x) // y=a^x (a为常数且以a>0，a≠1)
    });
    console.log('a',a)

    useEffect(() => {
        drawMap()
    }, []);

    useEffect(() => {
        updateMap()
    }, [a]);


    // 画图
    const drawMap = () => {
      const container = document.getElementById("containerExp1")
      
      const containerWidth = container.parentElement.offsetWidth
      const margin = { top: 40, right: 40, bottom: 40, left: 40 }
      
      setExponentialLine({
          width: containerWidth - margin.left - margin.right,
          height: containerWidth - margin.left - margin.right,
          fy: exponentialLine.fy
      })
      let width = containerWidth - margin.left - margin.right;
      let height = containerWidth - margin.left - margin.right;
      let fy = exponentialLine.fy;

      let chart = d3
          .select(container)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
      
      a = a > 0 && a !== 1 ? a : Math.E;
      
      let points = [];
      let formatXY = d3.format('.2f')

      d3.range(-10, 10, 0.05).forEach(function(item) {
        const itemX = formatXY(item)
        const itemY = formatXY(fy(item, a))
        points.push([itemX, itemY])
      })

      console.log('points',points)
  
      let x = d3
        .scaleLinear()
        .domain([-10, 10])
        .range([0, width])
      let y = d3
        .scaleLinear()
        .domain([10, -10])
        .range([0, height])
  
      let line = d3
        .line()
        .x(function(d) {
          return x(d[0])
        })
        .y(function(d) {
          return y(d[1])
        })
  
    
        let g = chart
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')') // 设最外包层在总图上的相对位置
  
      g.append('g') // 画x轴
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + y(0) + ')')
        .call(d3.axisBottom(x).ticks(20))
        .append('text')
        .attr('x', width)
        .attr('y', 26)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('fill', '#000')
        .style('font-size', '16px')
        .text('x')
  
      g.selectAll('.axis--x .tick') // x轴背景线
        .append('line')
        .attr('class', 'bg-line')
        .attr('stroke', 'rgba(0,0,0,0.1)')
        .attr('shape-rendering', 'crispEdges')
        .attr('transform', 'translate(' + 0 + ',' + -1 * y(0) + ')')
        .attr('y2', height)
  
      g.append('g') // 画y轴
        .attr('class', 'axis axis--y')
        .attr('transform', 'translate(' + x(0) + ',0)')
        .call(d3.axisLeft(y).tickValues(d3.range(-10, 11)))
        .append('text')
        .attr('y', -20)
        .attr('dy', '.71em')
        .style('text-anchor', 'start')
        .style('fill', '#000')
        .style('font-size', '16px')
        .text('y')
  
      g.selectAll('.axis--y .tick') // x轴背景线
        .append('line')
        .attr('class', 'bg-line')
        .attr('stroke', 'rgba(0,0,0,0.1)')
        .attr('shape-rendering', 'crispEdges')
        .attr('transform', 'translate(' + -1 * x(0) + ',' + 0 + ')')
        .attr('x2', width)
  
      g.append('g') // 输线条
        .attr('class', 'line-container')
        .datum(points)
        .append('path') // 绘画线条
        .attr('class', 'line')
        .style('stroke', 'blue')
        .attr('fill', 'none')
        .attr('d', line)

    }
    // 更新图
    const updateMap = () => { 
        const container = document.getElementById("containerExp1")
        
        const containerWidth = container.parentElement.offsetWidth
        const { width, height, fy } = exponentialLine
      
        a = a > 0 && a !== 1 ? a : 2;

        let points = []
        let formatXY = d3.format('.2f')
      d3.range(-10, 10, 0.05).forEach(function (item) {
          
        console.log('item',item)

          const itemX = formatXY(item)
          const itemY = formatXY(fy(itemX, a))
          points.push([itemX, itemY])
        })
        console.log('points',points)
      
      
        let x = d3
        .scaleLinear()
        .domain([-10, 10])
        .range([0, width])
      
       let y = d3
          .scaleLinear()
          .domain([10, -10])
          .range([0, height])
        let line = d3
          .line()
          .x(function(d) {
            return x(d[0])
          })
          .y(function(d) {
            return y(d[1])
          })
        let g = d3.select(container).select('.line-container')
        g.select('.line').remove().datum(points)
          .append('path') // 绘画线条
          .attr('class', 'line')
          .style('stroke', 'blue')
          .attr('fill', 'none')
          .attr('d', line)

    }
    console.log("exponentialLine",exponentialLine)


    return (
        <div className={styles.main}>
            <svg id="containerExp1"/>
        </div>
    );
};

export default D3ExponentialLine;
