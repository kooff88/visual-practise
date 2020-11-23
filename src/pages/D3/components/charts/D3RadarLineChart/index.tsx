import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import styles from './index.less';

const D3RadarLineChart: React.FC<{}> = (props) => {
    let { data } = props;

    useEffect(() => {
        drawMap()
    }, []);

    const drawMap = () => {
        const container = document.getElementById("containerRL")
        const containerWidth = container.parentElement.offsetWidth
        const margin = { top: 80, right: 80, bottom: 60, left: 60 }
        const width = containerWidth - margin.left - margin.right
        const height = 700 - margin.top - margin.bottom
        const outerRadius = Math.min(width, height) * 0.5

        let chart = d3
            .select(container)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        
        let g = chart
            .append('g')
            .attr('transform', `translate(${containerWidth / 2}, ${height-100})`)
        
        const names = {
            chinese: '语文',
            math: '数学',
            physics: '物理',
            chemistry: '化学',
            english:'英语'
        }

        const keys = Object.keys(data[0]).slice(1);

        const series = data.map(d => { 
            return keys.map(key => { 
                return {
                    key: key,
                    className: d.className,
                    value: d[key]
                }
            })
        })

        let x = d3
            .scaleBand()   // 定义x轴
            .range([0, 2 * Math.PI])
            .align(0)
        
        let y = d3.scaleLinear().range([0, outerRadius]); // 定义y轴

        let z = d3.scaleOrdinal(d3.schemeCategory10)// 通用线条的颜色

        const maxSerieValue = d3.max(series, (s) => { 
            return d3.max(s, (d) => d.value)
        })

        x.domain(keys) // x与Y轴的值域
        y.domain([0, maxSerieValue + 10])
        
        let defs = chart.append('defs')   // 添加圆形遮罩
        defs
            .selectAll('clipPath')
            .data(d3.range(data.length))
            .enter()
            .append('clipPath')
            .attr('id', (d, i) => 'clip_' + i)
            .append('circle')
            .attr('r', 0)
            .transition()
            .duration(500) 
            .delay((d, i) => i * 500)
            .attr('r', outerRadius)
        
        let yAxis = g    // 画y轴圈圈记文字
            .append('g')
            .attr('text-anchor', 'start')
        
        let yTick = yAxis
            .selectAll('g')
            .data(y.ticks(10).reverse())
            .enter()
            .append('g')
        
        yTick
            .append('circle')
            .attr('fill', "#ddd")
            .attr('stroke', '#999')
            .attr('fill-opacity', 0.3)
            .attr('r', y)
        
        yTick
            .append('text')
            .attr('x', 6)
            .attr('y', (d) => -y(d))
            .attr('dy', '0.35em')
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
            .selectAll('.tick')  // 绘画所有的轴线条
            .data(
                keys.map(key => { 
                    return [
                        { angle: 0, radius: 0 },
                        { angle: x(key), radius: y(maxSerieValue + 10) }
                      ]
                })
            )
            .enter()
            .append('g')
            .attr('class', 'tick')

    
        tick
            .append('path')  // 开始绘画所有轴线条
            .attr('class', 'tick-line')
            .style('stroke', '#fff')
            .style('stroke-width', 2)
            .attr('fill', 'none')
            .attr('d',
                d3.lineRadial()
                .angle(function(d) {
                    return d.angle
                  })
                  .radius(function(d) {
                    return d.radius
                  })
                  .curve(d3.curveLinearClosed)
            )
        
        g.selectAll('.tick-type')  // 绘画所有轴添加类型名
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
              
        let serie = g 
            .selectAll('.serie')  // 绘画雷达线条
            .data(series)
            .enter()
            .append('g')
            .attr('class', 'serie')
            .attr('clip-path', (d, i) => `url(#clip_${i})`)
        
        serie
            .append('path') // 开始绘画雷达线条
            .attr('class', 'radar-line')
            .style('stroke', (d) => z(d[0].className))
            .attr('fill', (d) => z(d[0].className))
            .attr('fill-opacity', 0.2)
            .attr('d',
                d3
                .lineRadial()
                .angle(function(d) {
                return x(d.key)
                })
                .radius(function(d) {
                return y(d.value)
                })
                .curve(d3.curveLinearClosed)
        )
            .append('title') 
            .text((d) => { 
                let str = d.map(t => `${names[t.key]}: ${t.value}分`).join('\n')
                return d[0].className + '\n' + str;
            })
        
        
        let legend = chart.append('g') // 图例
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .attr('transform', 'translate(-65, 65)')
            .attr('text-anchor', 'end')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(0,${i * 20})`)
        
        legend
            .append('rect')
            .attr('x', width - 19)
            .attr('width', 19)
            .attr('height', 19)
            .attr('fill', (d) => z(d.className))
        
        legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9.5)
            .attr('dy', '0.32em')
            .text(function(d) {
              return d.className
            })
    
        chart
            .append('g') // 输出标题
            .attr('class', 'radar-chart--title')
            .append('text')
            .attr('fill', '#000')
            .attr('font-size', '16px')
            .attr('font-weight', '700')
            .attr('text-anchor', 'middle')
            .attr('x', containerWidth / 2)
            .attr('y', 20)
        .text('XX年级期中考试平均成绩(分), 满分100分')
    }

    return (
        <div className={styles.main}>
            <svg id="containerRL"/>
        </div>
    );
}

export default D3RadarLineChart;
