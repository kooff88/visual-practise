import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import * as d3 from 'd3';
import styles from './index.less';
import { attr } from 'highcharts';




const PieChart: React.FC<{}> = (props) => {

    const data = [
        {name: "<5", value: 19912018},
        {name: "5-9", value: 20501982},
        {name: "10-14", value: 20679786},
        {name: "15-19", value: 21354481},
        {name: "20-24", value: 22604232},
        {name: "25-29", value: 21698010},
        {name: "30-34", value: 21183639},
        {name: "35-39", value: 19855782},
        {name: "40-44", value: 20796128},
        {name: "45-49", value: 21370368},
        {name: "50-54", value: 22525490},
        {name: "55-59", value: 21001947},
        {name: "60-64", value: 18415681},
        {name: "65-69", value: 14547446},
        {name: "70-74", value: 10587721},
        {name: "75-79", value: 7730129},
        {name: "80-84", value: 5811429},
        {name: "≥85", value: 5938752},
    ]

    useEffect(() => { 
        showPic()
    },[])


    const showPic = () => { 
        const container = document.getElementById("pieFirst")
        const containerWidth = container.parentElement.offsetWidth
        const margin = { top: 80, right: 80, bottom: 30, left: 60 }

        const width = containerWidth - margin.left - margin.right;
        const height = Math.min(width, 700);

        let chart = d3
            .select(container)
            .attr("width", width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // .attr("viewBox",  [-width / 2, -height / 2, width, height])
            .attr("viewBox",  [-width / 2, -height / 2, width, height])

        let pie = d3.pie()
            .sort(null)
            .value(d => d.value)

        let color = d3.scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
        
        let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 1)
        
       
        const radius = Math.min(width, height) / 2 * 0.8;
        let arcLabel = d3
            .arc()
            .innerRadius(radius)
            .outerRadius(radius)
        
        const arcs = pie(data);

        

        chart.append("g")
            .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`)
        
        chart.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.name)
            )
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", '0.7em')
                .attr("fill-opacity", 0.7)
                .text(d => d.data.value.toLocaleString())
        )
        
        // chart
        //     .append("g")
        //     .attr("class", "pie-line")
        //     .attr("fill", "#000")
        //     .attr("font-weight", "700")
        //     .attr("text-anchor", 'middle')
        //     .attr("x", 100)
        //     .attr("y", 100)
        //     .text("一个简单的饼图")
          
      chart
      .append('g') // 输出标题
      .attr('class', 'bar--title')
      .append('text')
      .attr('fill', '#000')
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle')
      .attr('x', -width/3)
      .attr('y', -height/2)
      .text('一张简单饼图')
        
    }

    return (
        <div className={styles.main}>
            <svg id="pieFirst" />
        </div>
    );
};

export default PieChart;
