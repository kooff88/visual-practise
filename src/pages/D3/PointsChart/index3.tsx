import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import * as d3 from 'd3';
import styles from './index.less';
import { attr } from 'highcharts';
import { translate } from '@antv/g2/lib/util/transform';




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


        chart.selectAll('circle')
            .data(circles)
            .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', radius)
            .attr('fill', d => d3.schemeCategory10[d.index % 10])
            .call(
                d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )
            .on("click", clicked);
        
        function clicked(event, d) { 
            if (event.defaultPrevented) return;

            d3.select(this).transition()
                .attr("fill", "black")
                .attr("r", radius * 2)
                .transition()
                .attr("r", radius)
                .attr("fill", d3.schemeCategory10[d.index % 10])

        }
    

        function dragstarted() { 
            d3.select(this).attr("stroke", "black")
        }

        function dragged(event, d) { 
            d3.select(this)
                .raise()
                .attr('cx', d.x = event.x)
                .attr('cy', d.y = event.y)
        }
        
        function dragended() { 
            d3.select(this).attr("stroke", null);
        }


    }

    return (
        <div className={styles.main}>
            <svg id="pointChart" />
        </div>
    );
};

export default PointsChart;
