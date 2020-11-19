import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Scene } from 'spritejs';
import { Cube, Light, shaders } from 'sprite-extend-3d';
// import { dataPie, dataPieLabel } from '../common/dataMock';
import githubJson from '@/pages/common/assets/github_contributions_akira-cn.json';
import * as d3 from 'd3';
import styles from './index.less';

const GithubContribute: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = () => {
    let cache = null;
    async function getData(toDate = new Date()) {
      if (!cache) {
        const data = githubJson;

        console.log('datadata', data);

        cache = data.contributions.map((o) => {
          o.date = new Date(o.date);
          return o;
        });
      }

      // 要拿到 toData 日期之前大约一年的数据（52周）
      let start = 0,
        end = cache.length;

      // 用二分法查找
      while (start < end - 1) {
        const mid = Math.floor(0.5 * (start + end));
        const { date } = cache[mid];
        if (date <= toDate) end = mid;
        else start = mid;
      }

      // 获得对应的一年左右的数据
      let day;
      if (end >= cache.length) {
        day = toDate.getDay();
      } else {
        const lastItem = cache[end];
        day = lastItem.date.getDay();
      }
      // 根据当前星期几，再往前拿52周的数据
      const len = 7 * 52 + day + 1;
      const ret = cache.slice(end, end + len);
      if (ret.length < len) {
        // 日期超过了数据范围，补齐数据
        const pad = new Array(len - ret.length).fill({ count: 0, color: '#ebedf0' });
        ret.push(...pad);
      }

      return ret;
    }

    (async function () {
      const container = document.getElementById('stage');

      const scene = new Scene({
        container,
        displayRatio: 2,
      });

      const layer = scene.layer3d('fglayer', {
        ambientColor: [0.5, 0.5, 0.5, 1],
        camera: {
          fov: 35,
        },
      });

      layer.camera.attributes.pos = [2, 6, 9];
      layer.camera.lookAt([0, 0, 0]);

      const light = new Light({
        direction: [-3, -3, -1],
        color: [1, 1, 1, 1],
      });

      layer.addLight(light);

      const program = layer.createProgram({
        vertex: shaders.GEOMETRY.vertex,
        fragment: shaders.GEOMETRY.fragment,
      });

      const dataset = await getData();
      const max = d3.max(dataset, (a) => {
        return a.count;
      });

      /* globals d3 */
      const selection = d3.select(layer);

      const chart = selection
        .selectAll('cube')
        .data(dataset)
        .enter()
        .append(() => {
          return new Cube(program);
        })
        .attr('width', 0.14)
        .attr('depth', 0.14)
        .attr('height', 1)
        .attr('scaleY', 0.001)
        .attr('pos', (d, i) => {
          const x0 = -3.8 + 0.0717 + 0.0015;
          const z0 = -0.5 + 0.05 + 0.0015;
          const x = x0 + 0.143 * Math.floor(i / 7);
          const z = z0 + 0.143 * (i % 7);
          // return [x, 0.5 * d.count / max, z];
          return [x, 0, z];
        })
        .attr('colors', (d, i) => {
          return d.color;
        });

      const fragment = `
      precision highp float;
      precision highp int;
      varying vec4 vColor;
      varying vec2 vUv;
      void main() {
        float x = fract(vUv.x * 53.0);
        float y = fract(vUv.y * 7.0);
        x = smoothstep(0.0, 0.1, x) - smoothstep(0.9, 1.0, x);
        y = smoothstep(0.0, 0.1, y) - smoothstep(0.9, 1.0, y);
        gl_FragColor = vColor * (x + y);
      }    
    `;

      const axisProgram = layer.createProgram({
        vertex: shaders.TEXTURE.vertex,
        fragment,
        // cullFace: null,
      });

      const ground = new Cube(axisProgram, {
        width: 7.6,
        height: 0.1,
        y: -0.049, // not 0.05 to avoid z-fighting
        depth: 1,
        colors: 'rgba(0, 0, 0, 0.1)',
      });

      layer.append(ground);

      const linear = d3.scaleLinear().domain([0, max]).range([0, 1.0]);

      chart
        .transition()
        .duration(2000)
        .attr('scaleY', (d, i) => {
          return linear(d.count);
        })
        .attr('y', (d, i) => {
          return 0.5 * linear(d.count);
        });

      layer.setOrbit();

      window.layer = layer;
    })();
  };

  return (
    <div className={styles.main}>
      <div id="stage" style={{ width: 600, height: 600 }}></div>
    </div>
  );
};

export default GithubContribute;
