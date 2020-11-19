import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
// import { dataPie, dataPieLabel } from '../common/dataMock';
import { Renderer, Program, Geometry, Transform, Mesh } from 'ogl';
import styles from './index.less';

const Lines: React.FC<{}> = (props) => {
  useEffect(() => {
    showPic();
  }, []);

  // 仿射变换
  const showPic = () => {
    const vertex = `
      attribute vec2 position;

      void main(){
        gl_PointSize = 10.0;
        float scale = 1.0 / 256.0;

        mat3 projectionMatrix = mat3(
          scale, 0, 0,
          0, -scale, 0,
          -1, 1, 1
        );
        vec3 pos = projectionMatrix * vec3( position, 1 );

        gl_Position = vec4( pos.xy, 0, 1 );
      }
    `;

    const fragment = `
      precision highp float;
      
      void main(){
        gl_FragColor = vec4( 1, 0, 0, 1 );
      }
    `;

    const canvas = document.querySelector('canvas');
    const renderer = new Renderer({
      canvas,
      width: 512,
      height: 512,
    });

    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const program = new Program(gl, {
      vertex,
      fragment,
    });

    const geometry = new Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([100, 100, 100, 200, 200, 150, 300, 200, 300, 100]),
      },
    });

    const scene = new Transform();
    const polyline = new Mesh(gl, { geometry, program, mode: gl.LINE_STRIP });
    polyline.setParent(scene);

    renderer.render({ scene });
  };

  return (
    <div className={styles.main}>
      <canvas width="1200" height="800"></canvas>
    </div>
  );
};

export default Lines;
