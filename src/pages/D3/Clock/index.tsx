import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import styles from './index.less';
import { attr } from 'highcharts';


const RadarLineChart: React.FC<{}> = (props) => {

    useEffect(() => { 
        showClick()
    },[])

    // 画图
    const showClick = () => {
        
        const clockRadius = 200,
            margin = 50,
            w = (clockRadius + margin) * 2,
            h = (clockRadius + margin) * 2,
            hourHandLength = (2 * clockRadius) / 3,
            minuteHandLength = clockRadius,
            secondHandLength = clockRadius - 12,
            secondHandBalance = 30,
            secondTickStart = clockRadius,
            secondTickLength = -10,
            hourTickStart = clockRadius,
            hourTickLength = -18,
            secondLabelRadius = clockRadius + 16,
            secondLabelYOffset = 5,
            hourLabelRadius = clockRadius - 40,
            hourLabelYOffset = 7,
            radians = Math.PI / 180;
        
        const twelve = d3
            .scaleLinear()
            .range([0, 360])
            .domain([0, 12])
        
        const sixty = d3
            .scaleLinear()
            .range([0, 360])
            .domain([0, 60])
        
        const handData = [
            {
                type: "hour",
                value: 0,
                length: -hourHandLength,
                scale: twelve
            },
            {
                type: "minute",
                value: 0,
                length: -minuteHandLength,
                scale: sixty
            },
            {
                type: "second",
                value: 0,
                length: -secondHandLength,
                scale: sixty,
                balance: secondHandBalance
            }
        ]


        function drawClock() { 
            const container = document.getElementById("clock");
            let chart = d3
                .select(container)
                .attr('width', 600 + margin)
                .attr('height', 600 + margin)

            console.log('chart',chart)
            
            let face = chart
                .append('g')
                .attr('id', "clock-face")
                .attr('transform', `translate(${[w / 2, h / 2]})`)
                console.log('chart',chart)

            // 秒标记
            face
                .selectAll('.second-tick')
                .data(d3.range(0, 60))
                .enter()
                .append('line')
                .attr('class', "second-tick")
                .attr("x1", 0)
                .attr('x2', 0)
                .attr('y1', secondTickStart)
                .attr('y2', secondTickStart + secondTickLength)
                .style("stroke-width", 3)
                .style("stroke", "#000")
                .attr('transform', d => `rotate(${sixty(d)})`)
            
            // 时标记
            face
            .selectAll(".second-label")
                .data(d3.range(5, 61, 5))
                .enter()
                .append("text")
                .attr("class", "second-label")
                .attr("text-anchor", "middle")
                .style("stroke-width", 2)
                .style("stroke", "gold")
                .attr("x", d => secondLabelRadius * Math.sin(sixty(d) * radians))
                .attr(
                "y",
                d =>
                    -secondLabelRadius * Math.cos(sixty(d) * radians) + secondLabelYOffset
                )
                .text(d => d);
            
            // 时 labels
            face
                .selectAll('.hour-tick')
                .data(d3.range(0, 12))
                .enter()
                .append('line')
                .attr('class', "hour-tick")
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', hourTickStart)
                .attr('y2', hourTickStart + hourTickLength)
                .style("stroke-width", 5)
                .style("stroke", "#000")
                .attr('transform', d => { 
                    return `rotate(${twelve(d)})`
                } )
            
            
            face
                .selectAll(".hour-label")
                .data(d3.range(3, 13, 3))
                .enter()
                .append("text")
                .attr("class", "hour-label")
                .attr("text-anchor", "middle")
                .style("stroke-width", 2)
                .style("stroke", "gold")
                .attr("x", d => hourLabelRadius * Math.sin(twelve(d) * radians))
                .attr(
                  "y",
                  d => -hourLabelRadius * Math.cos(twelve(d) * radians) + hourLabelYOffset
                )
                .text(d => d);

            const hands = face.append('g').attr('id', "clock-hands");

            hands
            .selectAll("line")
            .data(handData)
            .enter()
            .append("line")
            .attr("class", d => d.type + "-hand")
            .attr("x1", 0)
            .attr("y1", d => d.balance || 0)
            .attr("x2", 0)
            .attr("y2", d => d.length)
                .style("stroke-width", d => { 
                    let n = 3;
                    switch (d.type) { 
                        case "hour": n = 10; break; 
                        case "minute": n = 5; break; 
                        case "hour": n = 3; break;
                        default: break;
                    }
                    return n;
                })
            .style("stroke", "#000")
            .style("stroke-linecap", "round")
            .attr("transform", d => { 
                return `rotate(${Number(d.scale(d.value))})`
            } );
            
            face
                .append('g')
                .attr('id', "face-overlay")
                .append('circle')
                .attr('class', "hands-cover")
                .attr('x', 0)
                .attr('y', 0)
                .attr('r', clockRadius / 20)
            console.log('65', 6)
            

            face
                .append("text")
                .attr("x", -15)
                .attr("y", -60)
                .style("font-size", 20)
                .style("font-weight", 700)
                .attr("fill",'gold')
                // .attr("stroke", "orange")
                .text('金表')
            
        }

        function moveHands() { 
            d3.select('#clock-hands')
                .selectAll('line')
                .data(handData)
                .transition()
                .ease(d3.easeElastic.period(0.5))
                .attr("transform", d => { 
                    console.log('d',d)
                    console.log('d1',d.scale(d.value))
                    return `rotate(${Number(d.scale(d.value))})`
                } );
            
        }

        function updateData() { 
            const t = new Date();
            handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60;
            handData[1].value = t.getMinutes();
            handData[2].value = t.getSeconds();
        }

        drawClock();
        Animation
        const interval = setInterval(() => {
            updateData();
            moveHands();
        }, 1000);

    }


    return (
        <div className={styles.main}>
            <svg id="clock" />
        </div>
    );
};

export default RadarLineChart;
