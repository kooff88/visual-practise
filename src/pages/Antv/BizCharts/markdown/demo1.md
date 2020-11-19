## 实现代码

```tsx
import React, { useEffect, useState } from 'react';
import { Chart, Interval, Tooltip, Legend, View, Axis, Coordinate } from 'bizcharts';
import { DataView } from '@antv/data-set';

const data = [
  { type: '美市', value: 90 },
  { type: '阿里巴巴', value: 5 },
  { type: '腾讯', value: 4 },
  { type: '其他', value: 1 },
];

// 通过 DataSet 计算百分比
const dv = new DataView();
dv.source(data).transform({
  type: 'percent',
  field: 'value',
  dimension: 'type',
  as: 'percent',
});

const BizCharts: React.FC<{}> = (props) => {
  return (
    <div>
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
    </div>
  );
};

export default BizCharts;
```

### 代码行数: 66

<a href="https://www.bizcharts.net/product/BizCharts4/category/77/page/116" target="_blank">文档</a>
