import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import Highcharts from 'highcharts';
import showdown from 'showdown';
import demo1 from './markdown/demo1.md';
import { dataPieLabel, dataPieHigh } from '../common/dataMock';
import styles from './index.less';

const Demo1: React.FC<{}> = (props) => {
  useEffect(() => {
    getMarkdown();
    getChart();
  }, []);

  // 渲染图表
  const getChart = () => {
    let box = document.getElementById('pie');

    let optionData = getOption(); // 设置配置项

    //初始化echarts实例
    let myChart = Highcharts.chart(box, optionData);
  };

  // 设置配置项
  const getOption = () => {
    let options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: '金融市场占比',
        align: 'left',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      legend: {
        verticalAlign: 'top', //垂直方向位置
        x: 0, //距离x轴的距离
        y: -20,
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: '占比',
          colorByPoint: true,
          data: dataPieHigh,
        },
      ],
    };
    return options;
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

export default Demo1;
