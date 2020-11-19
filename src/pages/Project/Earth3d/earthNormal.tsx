import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import * as d3 from "../DataDemo1/d3v6.js";
// import * as d3 from "d3";
import {  Layer, Scene }  from 'spritejs';
import { Sphere} from 'sprite-extend-3d';
import worldData from "../D3/assets/data/world-topojson.json";
import * as Tapo from "../D3/assets/topojson.min.js"

import styles from './index.less';


const Earth3d: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  const showPic = async () => {
    const mapWidth = 960;
    const mapHeight = 480;
    const mapScale = 4;

    const projection = d3.geoEquirectangular();
    projection.scale(projection.scale() * mapScale).translate([mapWidth * mapScale * 0.5, (mapHeight + 2) * mapScale * 0.5]);

    const topojsonData = 'https://s5.ssl.qhres.com/static/843bbd2c37f94f26.json';

    async function loadMap(src = topojsonData, { strokeColor, fillColor } = {} ) { 
      const data = worldData;

      const countries = Tapo.feature(
        data,
        data.objects.countries
      );

      const canvas = new OffscreenCanvas(mapScale * mapWidth, mapScale * mapHeight);

      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = false;

      return drawMap({ context, countries, strokeColor, fillColor });
    }

    function drawMap({ context, countries, strokeColor = '#666', fillColor = '#000', strokeWidth = 1.5 } = {}) { 
      const path = d3.geoPath(projection).context(context);

      context.save();
      context.translate(0, mapScale * mapHeight);
      context.scale(1, -1);
      context.strokeStyle = strokeColor;
      context.lineWidth = strokeWidth;
      context.fillStyle = fillColor;
      context.beginPath();
      path(countries);
      context.fill();
      context.restore();

      const bitmap = context.canvas.transferToImageBitmap();
      return bitmap;
    }
    const vertex = `
      precision highp float;
      precision highp int;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec4 color;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat3 normalMatrix;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec4 vColor;
      uniform vec3 pointLightPosition; //点光源位置
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        vColor = color;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }    
    `;

    const fragment = `
      precision highp float;
      precision highp int;
      varying vec3 vNormal;
      varying vec4 vColor;
      uniform sampler2D tMap;
      varying vec2 vUv;
      uniform vec2 uResolution;
      void main() {
        vec4 color = vColor;
        vec4 texColor = texture2D(tMap, vUv);
        vec2 st = gl_FragCoord.xy / uResolution;
        float alpha = texColor.a;
        color.rgb = mix(color.rgb, texColor.rgb, alpha);
        color.rgb = mix(texColor.rgb, color.rgb, clamp(color.a / max(0.0001, texColor.a), 0.0, 1.0));
        color.a = texColor.a + (1.0 - texColor.a) * color.a;
        float d = distance(st, vec2(0.5));
        gl_FragColor.rgb = color.rgb + 0.3 * pow((1.0 - d), 3.0);
        gl_FragColor.a = color.a;
      } 
    `;
    const container = document.getElementById('container');
    const scene = new Scene({
      container
    });

    const layer = scene.layer3d('fglayer', {
      alpha: false,
      camera: {
        fov: 35,
        pos: [0, 0, 5]
      }
    });
    const texture = layer.createTexture({}); // 创建纹理对象
    
    loadMap().then((bitmap) => { 
      texture.image = bitmap;
      texture.needsUpdate = true;
      layer.forceUpdate();
    })
    
    const program = layer.createProgram({
      vertex,
      fragment,
      texture,
      cullFace: null
    })

  const globe = new Sphere(program, {
    colors: '#333',
    widthSegments: 64,
    heightSegments:32
  })

  layer.append(globe);

  layer.setOrbit({ autoRotate:false}); // 开启旋转控制

  const skyVertex = `
      precision highp float;
      precision highp int;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      uniform mat3 normalMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const skyFragment = `
      precision highp float;
      precision highp int;
      varying vec2 vUv;
      highp float random(vec2 co)
      {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
      }
      // Value Noise by Inigo Quilez - iq/2013
      // https://www.shadertoy.com/view/lsf3WH
      highp float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix( mix( random( i + vec2(0.0,0.0) ),
                        random( i + vec2(1.0,0.0) ), u.x),
                    mix( random( i + vec2(0.0,1.0) ),
                        random( i + vec2(1.0,1.0) ), u.x), u.y);
      }
      void main() {
        gl_FragColor.rgb = vec3(1.0);
        gl_FragColor.a = step(0.93, noise(vUv * 6000.0));
      }
    `;

    function createSky( layer, skyProgram ) { 
      skyProgram = skyProgram || layer.createProgram({
        vertex: skyVertex,
        fragment: skyFragment,
        transparent: true,
        cullFace: null,
      });

      const skyBox = new Sphere(skyProgram);
      skyBox.attributes.scale = 100;
      layer.append(skyBox);
      return skyBox;

    }

    createSky(layer);

  };

  return (
    <div>
      <div id="container" className={styles.container} style={{ width:1200, height:800 }}></div>
    </div>
  );
};

export default Earth3d;
