import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import * as d3 from 'd3';
import styles from './index.less';
import { attr } from 'highcharts';
import { translate } from '@antv/g2/lib/util/transform';




const PointsChart: React.FC<{}> = (props) => {

    const data = [
        [27.014457386807784, 168.37762136429475],
        [29.16082876354023, 143.58126091044315],
        [98.21117037224073, 124.62510810557518],
        [356.100090982035, 226.25655677050543],
        [538.4380917225908, 278.3004176524297],
        [618.8354284034182, 285.53782613047343],
        [756.715031306159, 278.2100856379776],
        [873.6259567496908, 239.5916869503974]
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

        const g = chart.append("g");

        g.selectAll(".point")
            .data(data)
            .join("circle")
            .attr("cx", ([x]) => x)
            .attr("cy", ([x, y]) => height - y)
            .attr("fill", d => `rgb(2,11,94)`)
            .attr("r", 3)
        
        let line = d3.line()
            .curve(d3.curveLinear)
            .x(d => d[0])
            .y(d => height - d[1])
        
        console.log(line(data));

        let lineGraph = g.append("path")
            .datum(data)
            .attr("stroke", "blue")
            .attr("stroke-width", 0.5)
            .attr("stroke", "rgb(2,11,94)")
            .attr("fill", "none")
            .attr("d", line(data))
           
        chart.call(d3.zoom()
            .extent([[0, 0], [width, height]])
            .scaleExtent([1, 8])
            .on("zoom", zoomed));

        function zoomed(obj) {
            console.log("obj==<>", obj);
            // g.attr("transform", d3.event.transform);
            g.attr("transform",  obj.transform);
          }
        
        
    }

    return (
        <div className={styles.main}>
            <svg id="pointChart" />
        </div>
    );
};

export default PointsChart;
