import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { CSSTransition } from 'react-transition-group'

// import styles from './index.less';
import './asd.css';

const TransitionGroup: React.FC<{}> = (props) => {
	const [ star, setStar ] = useState<boolean>(false);
	 
	// 处理星星
	const handleStar = () => { 
		setStar(true);
	}

  return (
    <div>
			<Button onClick={ handleStar} >start</Button>
			<CSSTransition
				in={star}
				timeout={300}
				classNames={'star'}
				unmountOnExit
			>

				<div className={  'star' }>⭐</div>
			</CSSTransition>
		</div>
  );
};

export default TransitionGroup;
