import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import styles from './index.less';

const D3SimpleAreaChart: React.FC<{}> = (props) => {
    let { rawData } = props;

    useEffect(() => {
        drawMap()
    }, []);

    const drawMap = () => {
        const container = document.getElementById("containerAC")
        const containerWidth = container.parentElement.offsetWidth
        const margin = { top: 80, right: 40, bottom: 130, left: 40 }
        const margin2 = { top: 410, right: 40, bottom: 60, left: 40 }
        const width = containerWidth - margin.left - margin.right
        const height = 500 - margin.top - margin.bottom
        const height2 = 500 - margin2.top - margin2.bottom

        let chart = d3
            .select(container)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height2 + margin2.top + margin2.bottom);  // 设置总宽高
        const parseData = d3.timeParse('%Y-%m');

        const data = rawData.map(item => { 
            return { ...item, day: parseData(item.day) }
        })

        let x = d3
            .scaleTime()
            .range([0, width])
            .domain(
                d3.extent(data, (d) => d.day)
            )  // 设置mainChart x轴
        
        let x2 = d3
            .scaleTime()
            .range([0, width])
            .domain(x.domain());  // 设置sunChart x轴
        
        let y = d3
            .scaleLinear()
            .rangeRound([height, 0])
            .domain([
                0,
                d3.max(data, (d) => d.quantity)
            ]) // 设置 mainChart y轴
        
        let y2 = d3
            .scaleLinear()
            .range([height2, 0])
            .domain(y.domain()); // 设置subChart y轴
        
        const brush = d3
            .brushX() // 设置brush
        
        


        



     
    }

    return (
        <div className={styles.main}>
            <svg id="containerAC"/>
        </div>
    );
}

export default D3SimpleAreaChart;
