import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import D3SimplePieChart from '../components/charts/D3SimplePieChart'
// import D3SimpleRingChart from '../components/charts/D3SimpleRingChart'
import styles from './index.less';



const SimplePieChart: React.FC<{}> = (props) => {

  const data = [
    { age: "<5", population: 2704659 },
    { age: '5-13', population: 4499890 },
    { age: '14-17', population: 2159981 },
    { age: '18-24', population: 3853788 },
    { age: '25-44', population: 14106543 },
    { age: '45-64', population: 8819342 },
    { age: '≥65', population: 612463 }
  ]
 

    return (
        <div className={styles.main}>
          <Row gutter={10}>
            <Col className="gutter-row" md={12}>
              <div className="gutter-box">
                <Card title="D3 简单圆环图" bordered={false}>
                  {/* <D3SimpleRingChart data={data} /> */}
                </Card>
              </div>
            </Col>
            <Col className="gutter-row" md={12}>
              <div className="gutter-box">
                <Card title="D3 简单饼图" bordered={false}>
                  <D3SimplePieChart data={data} />
                </Card>
              </div>
            </Col>
          </Row>
        </div>
    );
};

export default SimplePieChart;
