import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Chart } from '@antv/g2';
import showdown from 'showdown';
import demo1 from './markdown/demo1.md';
// import { dataPie, dataPieLabel } from '../common/dataMock';
import styles from './index.less';

const data = [
  { item: '美市', count: 90, percent: 0.9 },
  { item: '阿里巴巴', count: 5, percent: 0.05 },
  { item: '腾讯', count: 4, percent: 0.04 },
  { item: '其他', count: 1, percent: 0.01 },
];

const G2: React.FC<{}> = (props) => {
  useEffect(() => {
    getMarkdown();
    getChart();
  }, []);

  // 渲染图表
  const getChart = () => {
    let box = document.getElementById('pie'); // 获取容器

    //初始化echarts实例
    const chart = new Chart({
      container: 'pie',
      autoFit: true,
      title: '金融市场占比',
      height: 500,
    });

    chart.coordinate('theta', {
      radius: 0.75,
    });

    chart.data(data);

    chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });

    chart.tooltip({
      showTitle: true,
      showMarkers: false,
    });

    chart
      .interval()
      .position('percent')
      .color('item')
      .label('percent', {
        content: (data) => {
          return `${data.item}: ${data.percent * 100}%`;
        },
      })
      .adjust('stack');

    chart.interaction('element-active');

    chart.legend({
      position: 'top',
    });
    chart.render();
  };

  // // 设置配置项
  // const getOption = () => {
  //   let option = {
  //     title: {
  //       text: '金融市场占比',
  //       left: 'left',
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{a} <br/>{b} : {d}%',
  //     },
  //     legend: {
  //       // orient: 'vertical',
  //       // left: 'left',
  //       top: 20,
  //       data: dataPieLabel,
  //     },
  //     series: [
  //       {
  //         name: '访问来源',
  //         type: 'pie',
  //         radius: '55%',
  //         center: ['50%', '60%'],
  //         data: dataPie,
  //         emphasis: {
  //           itemStyle: {
  //             shadowBlur: 10,
  //             shadowOffsetX: 0,
  //             shadowColor: 'rgba(0, 0, 0, 0.5)',
  //           },
  //         },
  //       },
  //     ],
  //   };
  //   return option;
  // };

  const getMarkdown = () => {
    let converter = new showdown.Converter();
    let html = converter.makeHtml(demo1);
    document.getElementById('markdown').innerHTML = html;
  };
  return (
    <div className={styles.main}>
      <Card>
        <h1>金融市场占比</h1>
        <div id="pie" />
      </Card>
      <Card className={styles.card}>
        <div id="markdown">markdown</div>
      </Card>
    </div>
  );
};

export default G2;
