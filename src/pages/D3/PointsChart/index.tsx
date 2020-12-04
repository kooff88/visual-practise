import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import * as d3 from 'd3';
import styles from './index.less';
import { attr } from 'highcharts';




const PointsChart: React.FC<{}> = (props) => {

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
        const container = document.getElementById("pointChart")
        const containerWidth = container.parentElement.offsetWidth
        const margin = { top: 80, right: 80, bottom: 30, left: 60 }

        const width = containerWidth - margin.left - margin.right;
        const height = Math.min(width, 700);

        let chart = d3
            .select(container)
            .attr("width", width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // .attr("viewBox",  [-width / 2, -height / 2, width, height])
            // .attr("viewBox",  [-width / 2, -height / 2, width, height])

        console.log('asdasd',height)
        let z = d3.scaleOrdinal(d3.schemeCategory10);
        // 制作x轴
        const xScale = d3
            .scaleLinear()
            .domain([0, 10])
            .range([30, width])
        const xAxis = chart
            .append("g")
            .attr("transform", `translate(0, ${height})`)
        d3.axisBottom(xScale)(xAxis)

        //制作y轴
        const yScale = d3
            .scaleLinear()
            .domain([0, 10])
            .range([height, 20])
        const yAxis = chart
            .append("g")
            .attr("class", 'axis axis--y')
            .attr("transform", `translate(30,0)`)
            .call( d3.axisLeft(yScale))
            .append("text")
            .attr("y", 10)
            .attr('dy', '.71em')
            .style('text-anchor', 'start')
            .style('fill', '#000')
            .style("font-size",20)
            .text('健康指数 (分)')

        
        for (let i = 0; i < 10; i++) { 
            const x = Math.random() * 10;
            const y = Math.random() * 10;

            chart
                .append("circle")
                .attr("r",20)
                .attr("cx", xScale(x))
                .attr("cy", yScale(y))
                .attr("fill", d => z(i))
        }

        
    }

    return (
        <div className={styles.main}>
            <svg id="pointChart" />
        </div>
    );
};

export default PointsChart;
