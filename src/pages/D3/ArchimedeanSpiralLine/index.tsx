import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import D3ArchimedeanSpiralLine from "../components/math/D3ArchimedeanSpiralLine";
import { ArchimedeanSpiralLineObj } from './util'
import styles from './index.less';



const ArchimedeanSpiralLine: React.FC<{}> = (props) => {

    const [archimedeanSpiralLine, setArchimedeanSpiralLine] = useState<ArchimedeanSpiralLineObj>({
        a: 0,
        b: 1
    });




    useEffect(() => {
        
    }, []);


    const onArchimedeanSpiralLineAChange = (e:any) => { 
        const value = 1 * e.target.value;
        let temp = Object.assign({}, archimedeanSpiralLine, { a: value } )
        setArchimedeanSpiralLine(temp);
    }

    const onArchimedeanSpiralLineBChange = (e:any) => { 
        const value = 1 * e.target.value;
        let temp = Object.assign({}, archimedeanSpiralLine, { b: value } )
        setArchimedeanSpiralLine(temp);
    }


    return (
        <div className={styles.main}>
            <Row gutter={ 10 }>
                <Col md={ 24}>   
                    <div>
                        <Card
                            title={
                                <span>
                                    阿基米德螺线，r = a + bθ 设: a =
                                    <Input
                                        placeholder="请输入a的值"
                                        style={{ width: '15%' }}
                                        type="number"
                                        onChange={onArchimedeanSpiralLineAChange}
                                        value={archimedeanSpiralLine.a}
                                    />{' '}
                                        b =
                                    <Input
                                        placeholder="请输入b的值"
                                        style={{ width: '15%' }}
                                        type="number"
                                        onChange={onArchimedeanSpiralLineBChange}
                                        value={archimedeanSpiralLine.b}
                                    />
                                </span>
                            }
                            bordered={ false}
                        >
                            <D3ArchimedeanSpiralLine
                                a={ archimedeanSpiralLine.a }
                                b={ archimedeanSpiralLine.b }
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ArchimedeanSpiralLine;
