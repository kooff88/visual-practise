import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input } from 'antd'
import D3EquiangularSpiralLine from "../components/math/D3EquiangularSpiralLine";
import { EquiangularSpiralLineObj } from './interface'
import styles from './index.less';



const EquiangularSpiralLine: React.FC<{}> = (props) => {

    const [equiangularSpiralLine, setEquiangularSpiralLine] = useState<EquiangularSpiralLineObj>({
        a: 0.6,
        k: 0.2
    });




    useEffect(() => {
        
    }, []);


    const onEquiangularSpiralLineAChange = (e:any) => { 
        const value = 1 * e.target.value;
        let temp = Object.assign({}, equiangularSpiralLine, { a: value } )
        setEquiangularSpiralLine(temp);
    }

    const onEquiangularSpiralLineKChange = (e:any) => { 
        const value = 1 * e.target.value;
        let temp = Object.assign({}, equiangularSpiralLine, { k: value } )
        setEquiangularSpiralLine(temp);
    }


    return (
        <div className={styles.main}>
            <Row gutter={ 10 }>
                <Col md={ 24}>   
                    <div>
                        <Card
                            title={
                                <span>
                                   等角螺线, r=a*e^(kθ), a,k是常数,r是极径,θ是极角 设: a =
                                    <Input
                                        placeholder="请输入a的值"
                                        style={{ width: '15%' }}
                                        type="number"
                                        onChange={onEquiangularSpiralLineAChange}
                                        value={equiangularSpiralLine.a}
                                    />{' '}
                                    <Input
                                        placeholder="请输入b的值"
                                        style={{ width: '15%' }}
                                        type="number"
                                        onChange={onEquiangularSpiralLineKChange}
                                        value={equiangularSpiralLine.k}
                                    />
                                </span>
                            }
                            bordered={ false}
                        >
                            <D3EquiangularSpiralLine
                                a={ equiangularSpiralLine.a }
                                K={ equiangularSpiralLine.K }
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default EquiangularSpiralLine;
