import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import D3SimpleChinaMap from "../components/charts/D3SimpleChinaMap";
import styles from './index.less';



const SimpleChinaMap: React.FC<{}> = (props) => {

    const [geodata, setGeodata] = useState<object>({});


    useEffect(() => { 
        getData()
    }, [])
    
    const getData = async () => { 
        try {
            const res =await  fetch("http://cdn.a4z.cn/json/china.geojson");
            const data =await res.json();
            console.log('data',data)
            setGeodata(data)
        } catch (err) { 
            console.log(err)
        }
    }

    return (
        <div className={styles.main}>
            <Row gutter={10}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card title="D3 简单中国地图" bordered={false}>
                            { geodata.features  && <D3SimpleChinaMap data={geodata} />}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SimpleChinaMap;
