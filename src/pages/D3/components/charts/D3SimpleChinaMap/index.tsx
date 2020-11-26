import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
import styles from './index.less';



const D3SimpleChinaMap: React.FC<{}> = (props) => {
    let { data } = props;

  console.log('123',data)
  
    useEffect(() => {
        drawMap()
    }, []);

  const drawMap = () => {
    const container = document.getElementById("containerSCM")
    const containerWidth = container.parentElement.offsetWidth
    const margin = { top: 80, right: 20, bottom: 30, left: 60 }

    const width = containerWidth - margin.left - margin.right
    const height = 1000 - margin.top - margin.bottom

    let chart = d3
      .select(container)
      .attr("width", width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      
    
      let projection = d3
      .geoMercator() // 定义墨卡托地理投射(平面投射)
      .center([107, 31])
      .scale(d3.min([width, height]))
      .translate([width / 2, height / 2])

    let path = d3
      .geoPath() // 定义路径
      .projection(projection)
    
    
    
    let d3_category = [
      0xd3fe14, 0xfec7f8, 0x0b7b3e, 0x0bf0e9, 0xc203c8, 0xfd9b39, 0x888593, 
      0x906407, 0x98ba7f, 0xfe6794, 0x10b0ff, 0xac7bff, 0xfee7c0, 0x964c63, 
      0x1da49c, 0x0ad811, 0xbbd9fd, 0xfe6cfe, 0x297192, 0xd1a09c, 0x78579e, 
      0x81ffad, 0x739400, 0xca6949, 0xd9bf01, 0x646a58, 0xd5097e, 0xbb73a9, 
      0xccf6e9, 0x9cb4b6, 0xb6a7d4, 0x9e8c62, 0x6e83c8, 0x01af64, 0xa71afd, 
      0xadaefc, 0x5bd14e, 0xdf9ceb, 0xfe8fb1, 0x87ca80, 0xfc986d, 0x2ad3d9, 
      0xe8a8bb, 0xa7c79c, 0xa5c7cc, 0x7befb7, 0xb7e2e0, 0x85f57b, 0xf5d95b, 
      0xdbdbff, 0xfddcff, 0x6e56bb, 0x226fa8, 0x5b659c, 0x58a10f, 0xe46c52, 
      0x62abe2, 0xc4aa77, 0xb60e74, 0x087983, 0xa95703, 0x2a6efb, 0x427d92
    ].map(d3_rgbString)


    function d3_rgbString (value) {
      return d3.rgb(value >> 16, value >> 8 & 0xff, value & 0xff);
    }
    // let z = d3.scaleOrdinal(d3.schemeCategory10); // 通用线条的颜色  schemeCategory20 5.0版本已废弃。
    let z = d3.scaleOrdinal()
      .domain(d3_category)
      .range(d3_category)
    
    let g = chart
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .style('fill-opacity', 0)
    
  
      let province = g
      .selectAll('path') // 绘画所有的省
      .data(data.features)
      .enter()
      .append('path')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
        .attr('fill', function (d, i) {
        return z(i)
      })
      .attr('d', path)
      .on('mouseover', function(d, i) {
        d3.select(this).attr('fill', 'yellow')
      })
      .on('mouseout', function(d, i) {
        d3.select(this).attr('fill', z(i.properties.childNum))
      })
  
  
      province
      .append('title') // 输出Title，mouseover显示
      .text(function(d) {
        return d.properties.name
      })

    g.transition()
      .duration(1000)
      .style('fill-opacity', 1) // 动画渐现

    chart
      .append('g') // 输出标题
      .attr('class', 'bar--title')
      .append('text')
      .attr('fill', '#000')
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle')
      .attr('x', containerWidth / 2)
      .attr('y', 20)
      .text('中国地图')
    
    }

    return (
        <div className={styles.main}>
            <svg id="containerSCM"/>
        </div>
    );
}

export default D3SimpleChinaMap;
