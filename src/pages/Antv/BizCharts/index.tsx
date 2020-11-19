import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Chart, Interval, Tooltip, Legend, View, Axis, Coordinate } from 'bizcharts';
import { DataView } from '@antv/data-set';

import showdown from 'showdown';
import demo1 from './markdown/demo1.md';
// import { dataPie, dataPieLabel } from '../common/dataMock';
import styles from './index.less';

const data = [
  {
    type: '美市',
    value: 90,
  },
  {
    type: '阿里巴巴',
    value: 5,
  },
  {
    type: '腾讯',
    value: 4,
  },
  {
    type: '其他',
    value: 1,
  },
]; // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
// 通过 DataSet 计算百分比
const dv = new DataView();
dv.source(data).transform({
  type: 'percent',
  field: 'value',
  dimension: 'type',
  as: 'percent',
});

const BizCharts: React.FC<{}> = (props) => {
  useEffect(() => {
    getMarkdown();
  }, []);

  // 渲染图

  const getMarkdown = () => {
    let converter = new showdown.Converter();
    let html = converter.makeHtml(demo1);
    document.getElementById('markdown').innerHTML = html;
  };
  return (
    <div className={styles.main}>
      <Card>
        <h1>金融市场占比</h1>
        <Chart
          height={400}
          data={dv.rows}
          autoFit
          scale={{
            percent: {
              formatter: (val) => {
                val = (val * 100).toFixed(2) + '%';
                return val;
              },
            },
          }}
        >
          <Coordinate type="theta" radius={1} />
          <Axis />
          <Legend position="top" />
          <Tooltip />
          <Interval
            position="percent"
            adjust="stack"
            color="type"
            element-highlight
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
            label={[
              'type',
              {
                offset: -15,
              },
            ]}
          />
        </Chart>
      </Card>
      <Card className={styles.card}>
        <div id="markdown">markdown</div>
      </Card>
    </div>
  );
};

export default BizCharts;
