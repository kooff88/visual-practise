import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "../DataDemo1/d3v6.js";
// import * as d3 from "d3";
import {  Scene }  from 'spritejs';
import * as sprite3d from 'sprite-extend-3d';
import * as spriteGeo from "./sprite-geo-earth.min.js";
import * as Tapo from "./assets/topojson.min.js"
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
console.log('sprite3d',sprite3d)
console.log('spriteGeo',spriteGeo)
console.log('createGlobe',createGlobe)
console.log('addMarker',addMarker)
console.log('launchMissile',launchMissile)
console.log('cameraTo',cameraTo)

const Earth3d: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
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

    const globe = createGlobe(layer, {
      orbit: true,
      raycast: true,
      rotateY: 310,
      texture,
      normalMap: textureNormal,
      bumpMap,
      tick() {
        this.attributes.rotateY += 0.1;
      },
      normalScale: 20,
      highlight: false,
    });

    function randomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 100%, 50%)`;
    }

    setInterval(() => {
      const from = {
        latitude: 90 - 180 * Math.random(),
        longitude: 180 - 360 * Math.random(),
      };
      const to = {
        latitude: 90 - 180 * Math.random(),
        longitude: 180 - 360 * Math.random(),
      };
      const color = randomColor();
      const lifeTime = 1000;
      const height = 2.0;
      const width = 1.0;

      addMarker(globe, {
        ...from,
        lifeTime,
        height,
        color,
        width,
        // speed: 0.5,
        // segments: 4,
      });

      setTimeout(() => {
        addMarker(globe, {
          ...to,
          lifeTime,
          height,
          color,
          width,
          // speed: 0.5,
          segments: 4,
        });
      }, 0.5 * lifeTime);

      launchMissile(globe, {
        from,
        to,
        color,
        lifeTime,
        height,
        thickness: 0.75 * width,
      });
    }, 100);

    const curve = addCurve(globe, {
      from: {
        latitude: 0,
        longitude: 0,
      },
      to: {
        latitude: 30,
        longitude: 30,
      },
    });
  };

  return (
    <div>
      <div id="container" className={styles.container}></div>
    </div>
  );
};

export default Earth3d;
