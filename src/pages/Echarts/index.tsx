import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import echarts from 'echarts';
import showdown from 'showdown';
import demo1 from './markdown/demo1.md';
import { dataPie, dataPieLabel } from '../common/dataMock';
import styles from './index.less';

const Echarts: React.FC<{}> = (props) => {
  useEffect(() => {
    getMarkdown();
    getChart();
  }, []);

  // 渲染图表
  const getChart = () => {
    //初始化echarts实例
    let myChart = echarts.init(document.getElementById('pie'));

    // 设置配置项
    let optionData = getOption();
    //使用制定的配置项和数据显示图表
    myChart.setOption(optionData);
  };

  // 设置配置项
  const getOption = () => {
    let option = {
      title: {
        text: '金融市场占比',
        left: 'left',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {d}%',
      },
      legend: {
        // orient: 'vertical',
        // left: 'left',
        top: 20,
        data: dataPieLabel,
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: dataPie,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    return option;
  };

  const getMarkdown = () => {
    let converter = new showdown.Converter();
    let html = converter.makeHtml(demo1);
    document.getElementById('markdown').innerHTML = html;
  };
  return (
    <div className={styles.main}>
      <Card>
        <div id="pie" style={{ height: '500px' }} />
      </Card>
      <Card className={styles.card}>
        <div id="markdown">markdown</div>
      </Card>
    </div>
  );
};

export default Echarts;
