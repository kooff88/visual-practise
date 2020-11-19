## 实现代码

```tsx
import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

const Demo1: React.FC<{}> = (props) => {
  useEffect(() => {
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
          data:   {
            y: 90,
            name: '美市',
          },
          {
            y: 5,
            name: '阿里巴巴',
          },
          {
            y: 4,
            name: '腾讯',
          },
          {
            y: 1,
            name: '其他',
          },
        },
      ],
    };
    return options;
  };
  return (
    <div>
        <div id="pie" style={{ height: '500px' }} />
    </div>
  );
};

export default Demo1;
```

### 代码行数: 81

<a href="https://api.highcharts.com.cn/highcharts#accessibility" target="_blank">文档</a>
