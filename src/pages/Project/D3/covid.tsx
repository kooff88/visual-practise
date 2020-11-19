import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "../DataDemo1/d3v6.js";
// import * as d3 from "d3";
import { Scene, SpriteSvg } from 'spritejs';
import worldData from "./assets/data/world-topojson.json";
import covidData  from "./assets/data/covid-data.json";
import * as Tapo from "./assets/topojson.min.js"
import styles from './index.less';


console.log('Tapo',Tapo)
const D323: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = async () => {
    /* globals topojson */
    const width = 1024;
    const height = 512;
    function projection([longitude, latitude]) {
      const x = (width * (180 + longitude)) / 360;
      const y = height * (1.0 - (90 + latitude) / 180); // Canvas坐标系y轴朝下
      return [x, y];
    }

    function drawPoints(ctx, points) {
      ctx.beginPath();
      ctx.moveTo(...points[0]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(...points[i]);
      }
      ctx.fill();
    }
    
    function mapDataToCountries(geoData, covidData) { 
      const covidDataMap = {};
      covidData.dailyReports.forEach((d) => {
        const data = d.updatedDate;
        const countries = d.countries;
        countries.forEach((country) => {
          const name = country.country;
          covidDataMap[name] = covidDataMap[name] || {};
          covidDataMap[name][data] = country;
        });
      });

      geoData.features.forEach((d) => { 
        const name = d.properties.name;
        d.properties.covid = covidDataMap[name];
      })
    }

    function mapColor( confirmed ) {
      if (confirmed < 10) { 
        return 'rgb(250, 247, 171)';
      }
      if (confirmed < 100) {
        return "rgb(255, 186, 66)";
      }
      if (confirmed < 500) {
        return "rgb(234, 110, 41)";
      }
      if (confirmed < 1000) {
        return "rgb(224, 81, 57)";
      }
      if (confirmed < 10000) {
        return "rgb(192, 50, 39)";
      }
      return "rgb(151, 32, 19)";
    }

    function drawMap(ctx, countries, date) { 
      ctx.fillStyle = "#3ac";
      countries.features.forEach(({ geometry, properties }) => {
        const covid = properties.covid ? properties.covid[date] : null;
        if (covid) {
          const confirmed = covid.confirmed;
          if (confirmed) {
            ctx.fillStyle = mapColor(confirmed);
          }
        }
        if (geometry.type === "MultiPolygon") {
          const coordinates = geometry.coordinates;
          if (coordinates) {
            coordinates.forEach((contours) => {
              contours.forEach((path) => {
                const points = path.map(projection);
                drawPoints(ctx, points);
              });
            });
          }
        } else if (geometry.type === "Polygon") {
          const contours = geometry.coordinates;
          contours.forEach((path) => {
            const points = path.map(projection);
            drawPoints(ctx, points);
          });
        }
      });
    }

    
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const countries = Tapo.feature(
      worldData,
      worldData.objects.countries
    );
      
    console.log('asdasd',countries)

    mapDataToCountries(countries, covidData);
    drawMap(ctx, countries, "2020-01-22");

  };

  return (
    <canvas id="stage" className={styles.stage} ></canvas>
  );
};

export default D323;
