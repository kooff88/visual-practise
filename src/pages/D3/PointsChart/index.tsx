import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import * as d3 from 'd3';
import styles from './index.less';




const PointsChart: React.FC<{}> = (props) => {

    useEffect(() => { 
        showPic()
    },[])


    const showPic = () => { 
        const container = document.getElementById("pointChart")
        const containerWidth = container.parentElement.offsetWidth
        const margin = { top: 80, right: 80, bottom: 30, left: 60 }

        const width = containerWidth - margin.left - margin.right;
        const height = Math.min(width, 700);

        let radius = 32;

        let chart = d3
            .select(container)
            .attr("width", width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // .attr("viewBox", -width/2 , -height/2)
        

        const circles = d3.range(20).map(i => ({
            x: Math.random() * (width - radius * 2) + radius,
            y: Math.random() * (height - radius * 2) + radius,
            index: i
        }))


        let voronoi = d3.Delaunay
            .from(circles, d => d.x, d => d.y)
            .voronoi([0, 0, width, height])


        let circle = chart.append("g")
            .selectAll('circle')
            .data(circles)
            .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', radius)
            .attr('fill', d => d3.schemeCategory10[d.index % 10])

        let mesh = chart.append("path")
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1)
            .attr("d", voronoi.render());
        
        let cell = chart.append("g")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .selectAll("path")
            .data(circles)
            .join("path")
            .attr("d", (d, i) => voronoi.renderCell(i))
            .call(d3.drag()
            .on("start", (event, d) => circle.filter(p => p === d).raise().attr("stroke", "black"))
            .on("drag", (event, d) => (d.x = event.x, d.y = event.y))
            .on("end", (event, d) => circle.filter(p => p === d).attr("stroke", null))
            .on("start.update drag.update end.update", update));
        
        function update() { 
            voronoi = d3.Delaunay.from(circles, d => d.x, d => d.y).voronoi([0, 0, width, height]);
            circle.attr("cx", d => d.x).attr("cy", d => d.y);
            cell.attr("d", (d, i) => voronoi.renderCell(i));
            mesh.attr("d", voronoi.render());
        }
        
        


    }

    return (
        <div className={styles.main}>
            <svg id="pointChart" />
        </div>
    );
};

export default PointsChart;
