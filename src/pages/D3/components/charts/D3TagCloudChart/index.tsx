import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as d3Cloud from 'd3-cloud';
import d3Tip from 'd3-tip'
import styles from './index.less';



const D3TagCloudChart: React.FC<{}> = (props) => {
  let { data } = props;

  const [currentData, setCurrentData] = useState<unknown>({})

    useEffect(() => {
        drawMap()
    }, []);

  const drawMap = () => {
    const container = document.getElementById("tagCloudChart")
    const containerWidth = container.parentElement.offsetWidth
    const margin = { top: 80, right: 60, bottom: 80, left: 60 }

    const width = containerWidth - margin.left - margin.right
    const height = 1200 - margin.top - margin.bottom

    let chart = d3.select(container)
    
    let fill = d3.scaleOrdinal(d3.schemeCategory10);

    let words = data.map(item => {
      return {
        text: item.name,
        size: 10 + item.value * 8,
        href: item.href
      }
    })

    let layout = d3Cloud() // 构建云图
      .size([height, width])
      .words(words)
      .padding(5)
      .rotate(function () {
        return ~~(Math.random() * 2) * 90;
      })
      .font("Impack")
      .fontSize((d) => d.size)
      .on('end', draw)
    
    
    layout.start()
    

    function draw(words) { 
      console.log("words",words)

      // 输出所有标签
      let g = chart
        .attr("width", containerWidth)
        .attr("height", layout.size()[1])
        .append("g")
        .attr(
          'transform',
          `translate(${containerWidth / 2}, ${ layout.size()[1] / 2 })`
        )
        
      g.selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .on("click",  (d,dd)=> {
          window.open(dd.href)
        })
        .style("font-family", "Impact")
        .style("cursor", "pointer")
        .style("fill", (d, i) => fill(i))
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
        .style('font-size', d => `${d.size}px`)
        .text(d => d.text)
        .append("title")
        .text(d => d.href)
      
      
      g.selectAll("text") // 创建动画
        .style("fill-opacity", 0)
        .transition()
        .duration(200)
        .delay((d, i) => i * 200)
        .style("fill-opacity", 1)
      
      
    }
    

  }

  return (
      <div className={styles.main}>
          <svg id="tagCloudChart"/>
      </div>
  );
}

export default D3TagCloudChart;

