import React from 'react';

import styles from './Body.module.css';

const Body = ({ side, main }) => {
    return (
        <div className={styles.container}>
            <div className={styles.left}>{side}</div>
            <div className={styles.right}>{main}</div>
        </div>
    );
};

export default Body;