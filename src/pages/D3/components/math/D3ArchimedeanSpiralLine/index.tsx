import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { D3ArchimedeanSpiralLineObj } from "./interface";
import styles from './index.less';


const D3ArchimedeanSpiralLine: React.FC<{}> = (props) => {
    let { a, b } = props;

    console.log('a',a)
    console.log('b',b)
    const [archimedeanSpiralLine, setArchimedeanSpiralLine] = useState<D3ArchimedeanSpiralLineObj>({
        width: null,
        height: null,
        outerRadius: null,
        keys: null,
        fy: (x, a = 0, b = 1) => a + b * x // r = a + bθ（其中 a 和 b 均为实数。当θ = 0时，a为起点到极坐标原点的距离。 dr/dθ = b ，b为螺旋线旋转的角速度）
    });


    useEffect(() => {
        drawMap()
    }, []);

    useEffect(() => {
        updateMap()
    }, [a, b]);

    // 更新图
    const updateMap = () => { 
        const container = document.getElementById("container")

        let { outerRadius, fy } = archimedeanSpiralLine;
        // 更新线条
        let points = [];
        let formatXY = d3.format('.2f')
        d3.range(0, 4800, 5).forEach(function(item) {
          const angle = formatXY((item * Math.PI) / 180)
          const radius = formatXY(fy(angle, a, b))
          points.push([angle, radius])
        })
        let y = d3
          .scaleLinear()
          .range([0, outerRadius])
          .domain([0, 100])
        let g = d3.select(container).select('.line-container')
        g.select('.spiral-line').remove()
        g.append('path') // 绘画线条
          .datum(points)
          .attr('class', 'spiral-line')
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

    // 渲染图
    const drawMap = () => { 
        const container = document.getElementById("container")
        console.log('container',container)
        const containerWidth = container?.parentElement.offsetWidth;
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


        setArchimedeanSpiralLine({
            width: containerWidth - margin.left - margin.right,
            height: containerWidth - margin.left - margin.right,
            outerRadius: (containerWidth - margin.left - margin.right) * 0.5,
            keys: Object.keys(names),
            fy: archimedeanSpiralLine.fy
        })
        let width = containerWidth - margin.left - margin.right;
        let height = containerWidth - margin.left - margin.right;
        let outerRadius = (containerWidth - margin.left - margin.right) * 0.5;
        let keys = Object.keys(names);
        let fy = archimedeanSpiralLine.fy;

        
        let chart = d3
            .select(container)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
            
        let points = [];
        let formatXY = d3.format('.2f'); // 保留两位小数

        d3.range(0, 4800, 5).forEach((item) => {
            const angle = formatXY((item * Math.PI) / 180);
            const radius = formatXY(fy(angle, a, b));
            points.push([angle, radius]);
        });

        let x = d3
            .scaleBand()
            .range([ 0, 2 * Math.PI ])
            .align(0)
            .domain([0, 100])
            
        let y = d3
            .scaleLinear()
            .range([0, outerRadius])
            .domain([0, 100])
        
        
        console.log('y',y)
        
        let g = chart
            .append('g')
            .attr(
                'transform',
                `translate(${containerWidth / 2}, ${ (height + margin.top + margin.bottom ) / 2})`
            )
            console.log('g',g)
        
        let yAxis = g
            .append('g') // 画y轴圈圈及文字    
            .attr('text-anchor', 'start')
        
        let yTick = yAxis
            .selectAll('g')
            .data(y.ticks(10).reverse())
            .enter()
            .append('g')
        
        yTick
            .append('circle')
            .attr('fill', "#ddd")
            .attr("stroke", "#999")
            .attr('r', y);
        
        yTick
            .append('text')
            .attr('x', 6)
            .attr('y', (d) => {
                return -y(d);
             })
            .attr('dy', '0.35em')
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-width', 5)
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
            .attr("class", "tick")
        
        tick.append('path') // 开始绘画所有的轴线条
            .attr('class', 'tick-line')
            .style('stroke', "#999")
            .style('stroke-width', 1)
            .attr('fill', 'none')
            .attr('d',
                d3.lineRadial()
                    .angle((d) => d.angle)
                    .radius((d) => d.radius)
                    .curve(d3.curveLinearClosed)

        )

        g.selectAll(".tick-type") // 绘制所有轴添加类型名
            .data(keys)
            .enter()
            .append('text')
            .attr('class', 'tick-type')
            .attr('text-anchor', (d) => {
                return x(d) > Math.PI ?'end' : 'start'
            })
            .attr('x', (d) => Math.sin(x(d)) * (outerRadius + 10))
            .attr('y', (d) => Math.cos(x(d)) * (outerHeight + 10))
            .text((d) => names[d])
        
        g.append('g') // 开始绘画旋线条
            .attr('class', 'line-container')
            .append('path')
            .datum(points)
            .attr('class', 'spiral-line')
            .style('stroke', 'blue')
            .style('fill', 'none')
            .style('stroke-width', 1)
            .attr('d',
                d3
                .lineRadial()
                .angle((d) => d[0])
                .radius((d) => d[1])
                .curve(d3.curveLinear)
            )

    }
    console.log("archimedeanSpiralLine",archimedeanSpiralLine)


    return (
        <div className={styles.main}>
            <svg id="container"/>
        </div>
    );
};

export default D3ArchimedeanSpiralLine;
