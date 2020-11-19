## 实现代码

```tsx
import React, { useEffect } from 'react';
import { Chart } from '@antv/g2';

const data = [
  { item: '美市', count: 90, percent: 0.9 },
  { item: '阿里巴巴', count: 5, percent: 0.05 },
  { item: '腾讯', count: 4, percent: 0.04 },
  { item: '其他', count: 1, percent: 0.01 },
];

const G2: React.FC<{}> = (props) => {
  useEffect(() => {
    getChart();
  }, []);

  // 渲染图表
  const getChart = () => {
    let box = document.getElementById('pie'); // 获取容器

    //初始化容器
    const chart = new Chart({
      container: 'pie',
      autoFit: true,
      title: '金融市场占比',
      height: 500,
    });

    chart.coordinate('theta', {
      // theta, 一种特殊的极坐标系，半径长度固定，仅仅将数据映射到角度，常用于饼图的绘制。
      radius: 0.75,
    });

    //数据
    chart.data(data);

    // 度量单位
    chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });

    // 提示信息
    chart.tooltip({
      showTitle: true,
      showMarkers: false,
    });

    // 区间图
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

    chart.interaction('element-active'); //可交互

    // 图例
    chart.legend({
      position: 'top',
    });
    chart.render();
  };

  return (
    <div>
      <h1>金融市场占比</h1>
      <div id="pie" />
    </div>
  );
};

export default G2;
```

### 代码行数: 82
