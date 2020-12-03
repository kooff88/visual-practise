import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import * as d3 from 'd3';
import styles from './index.less';
import { attr } from 'highcharts';




const PieChartII: React.FC<{}> = (props) => {

    const data = [
        {name: "Failing", range: "-100 to -27", color: "#a2191f", textcolor: "#fff", value: 73.8},
        {name: "Below avg", range: "-26 to 8", color: "#ff7832", value: 34.8},
        {name: "Average", range: "9 to 25", color: "#f7cf2b", value: 16.8},
        {name: "Above avg", range: "26-40", color: "#42be65", value: 14.8},
        {name: "Excellent", range: "41-100", color: "#0e6027", textcolor: "#fff", value: 59.8},
    ]

    const data2 = [
        {name: "moeBelowSpace", color: "transparent", value: 109},
        {name: "moeBelow", color: "rgba(0,0,0,.3)", value: 16},
        {name: "npsScore", color: "black", value: 0.5},
        {name: "moeAbove", color: "rgba(0,0,0,.3)", value: 16},
        {name: "moeBelowSpace", color: "transparent", value: 59},
    ]


    useEffect(() => { 
        showPic()
    },[])


    const showPic = () => { 
        const container = document.getElementById("piecon")
        const container2 = document.getElementById("npsDial")

        console.log('container2',container2)
        const containerWidth = container.parentElement.offsetWidth
        const margin = { top: 80, right: 80, bottom: 30, left: 60 }

        const width = containerWidth - margin.left - margin.right;
        const height = Math.min(width, 700);

        let chart = d3
            .select(container)
            .attr("width", width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // .attr("viewBox",  [-width / 2, -height / 2, width, height])
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr('style', 'position:absolute;');
        
        let chart2 = d3
            .select(container2)
            .attr("width", width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // .attr("viewBox",  [-width / 2, -height / 2, width, height])
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr('style', 'position:absolute;');

        let pie = d3.pie()
            .sort(null)
            .startAngle(-0.8 * Math.PI)
            .endAngle(0.8 * Math.PI)
            .value(d => d.value)
        
        let arc = d3.arc()
            .innerRadius(150)
            .outerRadius(Math.min(width, height) / 2 - 1)
        
        
        const arcs = pie(data);
        
        chart.append("g")
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => d.data.color)
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`)
        
        const radius = Math.min(width, height) / 2 * 0.8;
        let arcLabel = d3
            .arc()
            .innerRadius(radius)
            .outerRadius(radius)

        chart.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .call(text => text.append('tspan')
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .attr("fill", d => d.data.textColor)
                .text(d => d.data.name)
            )
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill", d => d.data.textColor || '#000')
                .text(d => d.data.range)
        )
        
        const arcs2 = pie(data2)
        
        chart2.append("g")
            .selectAll("path")
            .data(arcs2)
            .join("path")
            .attr("fill", d => d.data.color)
            .attr("d",
                d3
                    .arc()
                    .innerRadius(0)
                    .outerRadius(Math.min(width, height) / 2 - 1)
                
            )
       
        
    }

    return (
        <div className={styles.main}>
            <svg id="piecon" />
            <svg id="npsDial" />
        </div>
    );
};

export default PieChartII;
