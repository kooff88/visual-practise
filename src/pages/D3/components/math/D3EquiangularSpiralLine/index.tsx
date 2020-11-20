import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { D3EquiangularSpiralLineObj } from "./interface";
import styles from './index.less';


const D3EquiangularSpiralLine: React.FC<{}> = (props) => {
    let { a, k } = props;

    const [equiangularSpiralLine, setEquiangularSpiralLine] = useState<D3EquiangularSpiralLineObj>({
        width: null,
        height: null,
        outerRadius: null,
        keys: null,
        fy: (x, a = 0.6, k = 0.2) => a * Math.pow(Math.E, k * x)  // r = a*e^(kθ),  a,k是常数， r是极径, θ是极角
    });


    useEffect(() => {
        drawMap()
    }, []);

    useEffect(() => {
        updateMap()
    }, [a, k]);


    // 画图
    const drawMap = () => { 
        const container = document.getElementById("containereq")
        
        const containerWidth = container.parentElement.offsetWidth
        const margin = { top: 60, right: 60, bottom: 60, left: 60 }
        const names = {
          degree_0: '0°',
          degree_45: '45°',
          degree_90: '90°',
          degree_135: '135°',
          degree_180: '180°',
          degree_225: '225°',
          degree_270: '270°',
          degree_315: '315°'
        }

        setEquiangularSpiralLine({
            width: containerWidth - margin.left - margin.right,
            height: containerWidth - margin.left - margin.right,
            outerRadius: (containerWidth - margin.left - margin.right) * 0.5,
            keys: Object.keys(names),
            fy: equiangularSpiralLine.fy
        })
        let width = containerWidth - margin.left - margin.right;
        let height = containerWidth - margin.left - margin.right;
        let outerRadius = (containerWidth - margin.left - margin.right) * 0.5;
        let keys = Object.keys(names);
        let fy = equiangularSpiralLine.fy;
        let chart = d3
            .select(container)
            .attr('width', width)
            .attr('height', height + margin.top + margin.bottom);
        
        let points = []
        d3.range(0, 10 * Math.PI, 0.01).forEach((item) => {
            const angle = item.toFixed(2, 10);
            const radius = fy(angle, a, k).toFixed(3, 10)
            points.push([ angle, radius ])
        })
        
        let x = d3
            .scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(keys)
        
        let y = d3
            .scaleLinear()
            .range([0, outerRadius])
            .domain([0, 10])  
        
        console.log('y',y)
        
        let g = chart
            .append('g')
            .attr(
                'transform',
                `translate(${containerWidth / 2}, ${(height + margin.top + margin.bottom) / 2})`
            )

        let yAxis = g
            .append('g') // 画y轴圈圈及文字
            .attr('text-anchor', 'start')
        let yTick = yAxis
            .selectAll('g')
            .data(y.ticks(10).reverse())
            .enter()
            .append('g');
        
        yTick
            .append('circle')
            .attr('fill', "#ddd")
            .attr("stroke", "#f00")
            .attr('fill-opacity', 0.3)
            .attr('r', y)
        
        yTick.
            append('text')
            .attr('x', 6)
            .attr('y', (d) => -y(d))
            .attr('dy', '0.35em')
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-width', 5)
            .text(y.tickFormat(10, 'r'))
        
        yTick
            .append('text')
            .attr('x', 6)
            .attr('y', function(d) {
              return -y(d)
            })
            .attr('dy', '0.35em')
            .text(y.tickFormat(10, 'r'))
        
        let tick = g
            .selectAll('.tick') // 绘画所有轴线条
            .data(
                keys.map(key => {
                    return [
                        { angle: 0, radius: 0 },
                        { angle: x(key), radius: outerRadius }
                    ]
                })
            )
            .enter()
            .append('g')
            .attr('class', 'tick')
        
        tick
            .append('path') // 开始绘画所有的轴线条
            .attr('class', 'tick-line')
            .style('stroke', 'green')
            .style('stroke-width', 1)
            .attr('fill', 'none')
            .attr(
              'd',
              d3
                .lineRadial()
                .angle(function(d) {
                  return d.angle
                })
                .radius(function(d) {
                  return d.radius
                })
                .curve(d3.curveLinearClosed)
            )
       
        g.selectAll('.tick-type') // 绘所有轴添加类型名
            .data(keys)
            .enter()
            .append('text')
            .attr('class', 'tick-type')
            .attr('text-anchor', function(d) {
              return x(d) > Math.PI ? 'end' : 'start'
            })
            .attr('x', function(d) {
              return Math.sin(x(d)) * (outerRadius + 10)
            })
            .attr('y', function(d) {
              return -1 * Math.cos(x(d)) * (outerRadius + 10)
            })
            .text(function(d) {
              return names[d]
            })
        
        g.append('g') // 开始绘画旋线条
            .attr('class', 'line-container')
            .append('path')
            .datum(points)
            .attr('class', 'spiral-line')
            .style('stroke', 'blue')
            .style('fill', 'none')
            .style('stroke-width', 1)
            .attr('d',
                d3.lineRadial()
                    .angle((d) => d[0])
                    .radius(d => y(d[1]))
                    .curve(d3.curveLinear)
            )

    }


    // 更新图
    const updateMap = () => { 
        const container = document.getElementById("containereq")
        
        const containerWidth = container.parentElement.offsetWidth

        let { outerRadius, fy } = equiangularSpiralLine;

        let points = [];
        d3.range(0, 10 * Math.PI, 0.01).forEach((item) => { 
            const angle = item.toFixed(2, 10)
            const radius = fy(angle, a, k).toFixed(3, 10)
            points.push([angle, radius])
        })

        let y = d3.
            scaleLinear()
            .range([0, outerRadius])
            .domain([0, 10])
        
        let g = d3.select(container).select('.line-container')
        g.select('.spiral-line').remove()
        g.append('path')
            .datum(points)
            .attr('class', "spiral-line")
            .style('stroke', 'blue')
            .style('fill', 'none')
            .style('stroke-width', 1)
            .attr(
                'd',
                d3
                .lineRadial()
                .angle(function(d) {
                    return d[0]
                })
                .radius(function(d) {
                    return y(d[1])
                })
                .curve(d3.curveLinear)
            )

    }
    console.log("equiangularSpiralLine",equiangularSpiralLine)


    return (
        <div className={styles.main}>
            <svg id="containereq"/>
        </div>
    );
};

export default D3EquiangularSpiralLine;
