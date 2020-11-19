import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';
import { AlertOutlined } from '@ant-design/icons';
import styles from './Welcome.less';

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <h1 className={styles.h11}>
        {' '}
        <AlertOutlined />
      </h1>
      <h1 className={styles.h11}> 可视化一般解决方案</h1>
    </Card>
  </PageContainer>
);
