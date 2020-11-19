import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "../DataDemo1/d3v6.js";
// import * as d3 from "d3";
import {  Scene }  from 'spritejs';
import * as sprite3d from 'sprite-extend-3d';
import * as spriteGeo from "./sprite-geo-earth.min.js";
import * as Tapo from "./assets/topojson.min.js"
import worldData from "./world-topojson.json";

import styles from './index.less';

const {
  createGlobe,
  unproject,
  highlightMap,
  launchMissile,
  addMarker,
  cameraTo,
  addCurve,
  addBeam
} = spriteGeo;


console.log('spriteGeo',spriteGeo)

const Earth3d: React.FC<{}> = (props) => {
  useEffect(() => {
    // showPic();
  }, []);

  const showPic = async () => {
    const container = document.getElementById('container');
    const scene = new Scene({
      container,
    });
    const layer = scene.layer3d('fglayer', {
      // directionalLight: [0, 0, 1, 0.5],
      pointLightColor: '#777777ff',
      pointLightPosition: [3, 3, 6],
      alpha: false,
      camera: {
        fov: 35,
      },
    });
    layer.camera.attributes.pos = [0, 0, 5000 / Math.min(layer.width, layer.height)];
    layer.camera.lookAt([0, 0, 0]);
    layer.gl.clearColor(0, 0, 0, 1);

 
    
    const texture = layer.createTexture('https://p2.ssl.qhimg.com/t0134698ab9018393c0.jpg');
    const textureNormal = layer.createTexture('https://p1.ssl.qhimg.com/t0157edc8fcd4163470.jpg');
    const bumpMap = layer.createTexture('https://p2.ssl.qhimg.com/t013dd5f9ce44ef8078.jpg');

    // 创建地球
    const globe = createGlobe(layer, {
      // program: null, // 这里有特殊需要可以传一个自定义的program进去，不过一般不需要
      // data: worldData, // 数据源，默认是测试数据源，可以传任何topojson格式的世界地理数据覆盖它
      orbit: false, // 是否允许鼠标操作，默认为 true
      raycast: true, // 是否允许地球被点击，默认为 false
      highlight: true, // 是否让鼠标移动时高亮地区，这个需要同时将raycast设为true生效
      sky: true, // 是否显示星空，默认为true
      skyProgram: null, // 如果自定义背景天空，可以传一个program进去
      corona: true, // 是否显示地球背景的光晕，默认为true
      coronaProgram: null, // 如果自定义背景光晕，可以传一个program进去
      autoResize: true, // 是否在容器大小变化时自适应大小
      texture: null, // 是否加载地图纹理，默认不加载则用数据画
      tick() { // 可以在每一帧更新地球属性
        this.attributes.rotateY += 0.1;
      },
      // ... 然后可以传其他的SpriteJS属性给元素
      rotateY: 150,
    });


    function randomPos() {
      return {
        latitude: -90 + 180 * Math.random(),
        longitude: -180 + 360 * Math.random(),
      };
    }
    
    function randomColor() {
      return `hsl(${Math.floor(360 * Math.random())}, 100%, 50%)`;
    }
    
    function randomSegments() {
      return [3, 4, 5, 60][Math.floor(4 * Math.random())];
    }
    
    function update() {
      const pos = randomPos();
    
      setTimeout(() => {
        addMarker(globe, {
          ...pos,
          color: randomColor(),
          segments: randomSegments(),
          height: 2.0,
          lifeTime: 2000,
        });
      }, 250);
    
      cameraTo(globe, pos);
    }
    
    setInterval(update, 3000);
  };

  return (
    <div>
      <div id="container" className={styles.container} style={{ width: 900, height:1200 }}></div>
    </div>
  );
};

export default Earth3d;
