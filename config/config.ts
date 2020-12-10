// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import chainWebpack from './webpack.config'
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/echarts',
              name: 'echarts',
              icon: 'bulb',
              routes: [
                {
                  path: '/echarts/demo',
                  name: 'demo',
                  component: './Echarts',
                },
              ],
            },
            {
              path: '/highcharts',
              name: 'highcharts',
              icon: 'bulb',
              routes: [
                {
                  path: '/highcharts/demo',
                  name: 'demo',
                  component: './Highcharts',
                },
              ],
            },
            {
              path: '/antv',
              name: 'antv',
              icon: 'bulb',
              routes: [
                {
                  path: '/antv/demo',
                  name: 'demo',
                  component: './Antv/G2',
                },
                {
                  path: '/antv/bizcharts',
                  name: 'bizcharts',
                  component: './Antv/BizCharts',
                },
              ],
            },
            {
              path: '/d3',
              name: 'd3',
              icon: 'bulb',
              routes: [
                {
                  path: '/d3/demo',
                  name: 'demo',
                  component: './D3',
                },

                // d3 示例练习
                {
                  path: '/d3/archimedeanSpiralLine',
                  name: 'archimedeanSpiralLine',
                  component: './D3/ArchimedeanSpiralLine',
                },

                {
                  path: '/d3/equiangularSpiralLine',
                  name: 'equiangularSpiralLine',
                  component: './D3/EquiangularSpiralLine',
                },
                {
                  path: '/d3/exponentialSpiralLine',
                  name: 'exponentialSpiralLine',
                  component: './D3/ExponentialSpiralLine',
                },
                {
                  path: '/d3/logarithmicSpiralLine',
                  name: 'logarithmicSpiralLine',
                  component: './D3/LogarithmicSpiralLine',
                },

                {
                  path: '/d3/groupedBarChart',
                  name: 'groupedBarChart',
                  component: './D3/GroupedBarChart',
                },
                
                //雷达线
                {
                  path: '/d3/radarLineChart',
                  name: 'radarLineChart',
                  component: './D3/RadarLineChart',
                },
                  //径向堆栈柱状图
                {
                  path: '/d3/radialStackedBarChart',
                  name: 'radialStackedBarChart',
                  component: './D3/RadialStackedBarChart',
                },

                {
                  path: '/d3/simpleAreaChart',
                  name: 'simpleAreaChart',
                  component: './D3/SimpleAreaChart',
                },

                {
                  path: '/d3/simpleBarChart',
                  name: 'simpleBarChart',
                  component: './D3/SimpleBarChart',
                },

                {
                  path: '/d3/simpleChinaMap',
                  name: 'simpleChinaMap',
                  component: './D3/SimpleChinaMap',
                },

                {
                  path: '/d3/simpleChordChart',
                  name: 'simpleChordChart',
                  component: './D3/SimpleChordChart',
                },

                {
                  path: '/d3/simpleDendrogramChart',
                  name: 'simpleDendrogramChart',
                  component: './D3/SimpleDendrogramChart',
                },

                {
                  path: '/d3/simpleForceChart',
                  name: 'simpleForceChart',
                  component: './D3/SimpleForceChart',
                },
                
                {
                  path: '/d3/simpleLineChart',
                  name: 'simpleLineChart',
                  component: './D3/SimpleLineChart',
                },
                
                {
                  path: '/d3/simpleLineChartII',
                  name: 'simpleLineChartII',
                  component: './D3/SimpleLineChartII',
                },
                
                {
                  path: '/d3/pieChart',
                  name: 'pieChart',
                  component: './D3/PieChart',
                },
                {
                  path: '/d3/pieChartII',
                  name: 'pieChartII',
                  component: './D3/PieChartII',
                },

                {
                  path: '/d3/simplePackChart',
                  name: 'simplePackChart',
                  component: './D3/SimplePackChart',
                },
                {
                  path: '/d3/simplePackChartII',
                  name: 'simplePackChartII',
                  component: './D3/SimplePackChartII',
                },

                {
                  path: '/d3/simplePieChart',
                  name: 'simplePieChart',
                  component: './D3/SimplePieChart',
                },

                {
                  path: '/d3/simplePointsChart',
                  name: 'simplePointsChart',
                  component: './D3/SimplePointsChart',
                },
                {
                  path: '/d3/pointsChart',
                  name: 'pointsChart',
                  component: './D3/PointsChart',
                },
                {
                  path: '/d3/tagCloudChart',
                  name: 'tagCloudChart',
                  component: './D3/TagCloudChart',
                },
                {
                  path: '/d3/clock',
                  name: 'clock',
                  component: './D3/Clock',
                },
              ],
            },
            {
              path: '/webGL',
              name: 'webGL',
              icon: 'bulb',
              routes: [
                {
                  path: '/webGL/affine',
                  name: 'affine',
                  component: './WebGL/Affine',
                },
                {
                  path: '/webGL/circle1',
                  name: 'circle1',
                  component: './WebGL/Circle1',
                },
                {
                  path: '/webGL/grid',
                  name: 'grid',
                  component: './WebGL/Grid',
                },
                {
                  path: '/webGL/maze',
                  name: 'maze',
                  component: './WebGL/Maze',
                },
                {
                  path: '/webGL/random',
                  name: 'random',
                  component: './WebGL/Random',
                },
                {
                  path: '/webGL/texture',
                  name: 'texture',
                  component: './WebGL/Texture',
                },
                {
                  path: '/webGL/control',
                  name: 'control',
                  component: './WebGL/Control',
                },
                {
                  path: '/webGL/polar',
                  name: 'polar',
                  component: './WebGL/Polar',
                },
                {
                  path: '/webGL/noise',
                  name: 'noise',
                  component: './WebGL/Noise',
                },
                {
                  path: '/webGL/later-period',
                  name: 'later-period',
                  component: './WebGL/LaterPeriod',
                },

                {
                  path: '/webGL/lines',
                  name: 'lines',
                  component: './WebGL/Lines',
                },

                {
                  path: '/webGL/performance',
                  name: 'performance',
                  component: './WebGL/Performance',
                },
             

                {
                  path: '/webGL/3d',
                  name: '3d',
                  icon: 'bulb',
                  routes: [
                    {
                      path: '/webGL/3d/base',
                      name: 'base',
                      component: './WebGL/ThreeD/Base',
                    },
                    {
                      path: '/webGL/3d/camera',
                      name: 'camera',
                      component: './WebGL/ThreeD/Camera',
                    },
                    {
                      path: '/webGL/3d/affine',
                      name: 'affine',
                      component: './WebGL/ThreeD/Affine',
                    },
                    {
                      path: '/webGL/3d/light',
                      name: 'light',
                      component: './WebGL/ThreeD/Light',
                    },
                    {
                      path: '/webGL/3d/normal-maps',
                      name: 'normal-maps',
                      component: './WebGL/ThreeD/NormalMaps',
                    },
                  ],
                },
              ],
            },
            {
              path: '/canvas',
              name: 'canvas',
              icon: 'bulb',
              routes: [
                {
                  path: '/canvas/demo1',
                  name: 'demo1',
                  component: './Canvas/Demo1',
                },
                {
                  path: '/canvas/demo2',
                  name: 'demo2',
                  component: './Canvas/Demo2',
                },
                {
                  path: '/canvas/grid',
                  name: 'grid',
                  component: './Canvas/Grid',
                },
                {
                  path: '/canvas/filter',
                  name: 'filter',
                  component: './Canvas/Filter',
                },
                {
                  path: '/canvas/polar',
                  name: 'polar',
                  component: './Canvas/Polar',
                },
                {
                  path: '/canvas/lines',
                  name: 'lines',
                  component: './Canvas/Lines',
                },
                {
                  path: '/canvas/performance',
                  name: 'performance',
                  component: './Canvas/Performance',
                },
              ],
            },
            {
              path: '/animate',
              name: 'animate',
              icon: 'bulb',
              routes: [
                {
                  path: '/animate/static',
                  name: 'static',
                  component: './Animate/Static',
                },
                {
                  path: '/animate/webGl-animate',
                  name: 'webGl-animate',
                  component: './Animate/WebGLA',
                },
              ],
            },
            {
              path: '/project',
              name: 'project',
              icon: 'bulb',
              routes: [
                {
                  path: '/project/github-contribute',
                  name: 'github-contribute',
                  component: './Project/GithubContrubute',
                },
                {
                  path: '/project/spots',
                  name: 'spots',
                  component: './Project/Spots',
                },
                {
                  path: '/project/datas',
                  name: 'datas',
                  component: './Project/Datas',
                },
                {
                  path: '/project/dataDemo1',
                  name: 'dataDemo1',
                  component: './Project/DataDemo1',
                },
                {
                  path: '/project/d3',
                  name: 'd3',
                  component: './Project/D3',
                },
                {
                  path: '/project/earth-d3',
                  name: 'd3',
                  component: './Project/D3',
                },
              ],
            },
            // {
            //   path: '/admin',
            //   name: 'admin',
            //   icon: 'crown',
            //   component: './Admin',
            //   authority: ['admin'],
            //   routes: [
            //     {
            //       path: '/admin/sub-page',
            //       name: 'sub-page',
            //       icon: 'smile',
            //       component: './Welcome',
            //       authority: ['admin'],
            //     },
            //   ],
            // },
            // {
            //   name: 'list.table-list',
            //   icon: 'table',
            //   path: '/list',
            //   component: './ListTableList',
            // },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  chainWebpack
});
