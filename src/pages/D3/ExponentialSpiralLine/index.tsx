import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input,message } from 'antd'
import D3ExponentialSpiralLine from "../components/math/D3ExponentialSpiralLine";
import { ExponentialSpiralLineObj } from './interface'
import styles from './index.less';



const ExponentialSpiralLine: React.FC<{}> = (props) => {

    const [exponentialSpiralLine, setExponentialSpiralLine] = useState<ExponentialSpiralLineObj>({
        a: 2,
    });



    const onExponentialSpiralLineAChange = (e:any) => { 
        const value = 1 * e.target.value;

        if (value <= 0 || value === 1) {
            message.error('a > 0 且 a ≠ 1');
        } else { 
            let temp = Object.assign({}, exponentialSpiralLine, { a: value } )
            setExponentialSpiralLine(temp);
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
                                        onChange={onExponentialSpiralLineAChange}
                                        value={exponentialSpiralLine.a}
                                    />{' '}
                                 
                                </span>
                            }
                            bordered={ false}
                        >
                            <D3ExponentialSpiralLine
                                a={ exponentialSpiralLine.a }
                       />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ExponentialSpiralLine;
