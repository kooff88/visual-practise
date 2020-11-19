import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "../DataDemo1/d3v6.js";
// import * as d3 from "d3";
import { Scene, SpriteSvg } from 'spritejs';
import * as worldData from "./assets/data/world-geojson.json";
import styles from './index.less';


const D323: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = async () => {
    const width = 1024;
    const height = 512;
    function projection([longitude, latitude]) {
      const x = width * (180 + longitude) / 360;
      const y = height * (1.0 - (90 + latitude) / 180); // Canvas坐标系y轴朝下
      return [x, y];
    }

    function drawPoints(ctx, points) {
      ctx.beginPath();
      ctx.moveTo(...points[0]);
      for(let i = 1; i < points.length; i++) {
        ctx.lineTo(...points[i]);
      }
      ctx.fill();
    }
    
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    // 例子
    const features = worldData.features;
    console.log('features',features)
    features.forEach(({geometry}) => {
      if(geometry.type === 'MultiPolygon') {
        const coordinates = geometry.coordinates;
        if(coordinates) {
          coordinates.forEach((contours) => {
            contours.forEach((path) => {
              const points = path.map(projection);
              drawPoints(ctx, points);
            });
          });
        }
      } else if(geometry.type === 'Polygon') {
        const contours = geometry.coordinates;
        contours.forEach((path) => {
          const points = path.map(projection);
          drawPoints(ctx, points);
        });
      }
    });

  };

  return (
    <canvas id="stage" className={styles.stage}  style={{ height:512,width:1024 }}></canvas>
  );
};

export default D323;
