interface Pie {
  value?: number;
  y?: number;
  name: string;
}

const dataPie: Pie[] = [
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
];
const dataPieHigh: Pie[] = [
  {
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
];

const dataPieLabel: string[] = ['美市', '阿里巴巴', '腾讯', '其他'];

export { dataPie, dataPieLabel, dataPieHigh };
