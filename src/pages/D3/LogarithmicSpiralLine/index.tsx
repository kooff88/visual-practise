import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input,message } from 'antd'
import D3LogarithmicSpiralLine from "../components/math/D3LogarithmicSpiralLine";
// import D3ExponentialLine from "../components/math/D3ExponentialLine";

import { LogarithmicSpiralLineObj } from './interface'
import styles from './index.less';



const LogarithmicSpiralLine: React.FC<{}> = (props) => {

    const [logarithmicSpiralLine, setLogarithmicSpiralLine] = useState<LogarithmicSpiralLineObj>({
        a: 2,
    });



    const onLogarithmicSpiralLineAChange = (e:any) => { 
        const value = 1 * e.target.value;

        if (value <= 0 || value === 1) {
            message.error('a > 0 且 a ≠ 1');
        } else { 
            let temp = Object.assign({}, logarithmicSpiralLine, { a: value } )
            setLogarithmicSpiralLine(temp);
        }
     
    }



    return (
        <div className={styles.main}>
            <Row gutter={ 10 }>
                <Col md={ 24}>   
                    <div>
                        <Card
                            title={
                                <span>
                                   指数函数图像-极坐标 y=a^x(a>0且a≠1) (x∈R) 设: a =
                                    <Input
                                        placeholder="请输入a的值"
                                        style={{ width: '15%' }}
                                        type="number"
                                        onChange={onLogarithmicSpiralLineAChange}
                                        value={logarithmicSpiralLine.a}
                                    />{' '}
                                 
                                </span>
                            }
                            bordered={ false}
                        >
                            <D3LogarithmicSpiralLine
                                a={ logarithmicSpiralLine.a }
                            />
                            {/* <D3ExponentialLine
                                a={LogarithmicSpiralLine.a }
                            />
                             */}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default LogarithmicSpiralLine;
