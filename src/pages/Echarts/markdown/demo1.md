## 实现代码

```tsx
import React, { useEffect } from 'react';
import echarts from 'echarts';

const Echarts: React.FC<{}> = (props) => {
  useEffect(() => {
    getChart();
  }, []);

  // 渲染图表
  const getChart = () => {
    let box = document.getElementById('pie'); // 容器

    let myChart = echarts.init(box); //实例化

    let optionData = getOption(); // 设置配置项

    myChart.setOption(optionData); //使用制定的配置项和数据显示图表
  };

  // 设置配置项
  const getOption = () => {
    let option = {
      title: {
        text: '金融市场占比',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {d}%',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['美市', '阿里巴巴', '腾讯', '其他'],
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            {
              value: 90,
              name: '美市',
            },
            {
              value: 5,
              name: '阿里巴巴',
            },
            {
              value: 4,
              name: '腾讯',
            },
            {
              value: 1,
              name: '其他',
            },
          ],
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

  return <div id="pie" style={{ height: '500px' }} />;
};

export default Echarts;
```

### 代码行数: 79

<a href="https://echarts.apache.org/zh/option.html#title" target="_blank">文档</a>
