import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import D3SimpleLineChart from "../components/charts/D3SimpleLineChart";
import styles from './index.less';



const SimpleLineChart: React.FC<{}> = (props) => {

    const data = [
        { date: '2009', apple: 130, banana: 40,value:40, },
        { date: '2010', apple: 137, banana: 58 ,value:58},
        { date: '2011', apple: 166, banana: 97, value: 97 },
        { date: '2012', apple: 154, banana: 117, value: 117 },
        { date: '2013', apple: 179, banana: 98, value: 98 },
        { date: '2014', apple: 187, banana: 120,value: 120 },
        { date: '2015', apple: 189, banana: 84, value:84 },
        { date: '2016', apple: 210, banana: 53 ,value:53} 
    ]


    return (
        <div className={styles.main}>
            <Row gutter={10}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card title="D3 简单线状图" bordered={false}>
                            <D3SimpleLineChart data={data} />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SimpleLineChart;
