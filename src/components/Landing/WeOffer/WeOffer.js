import React from "react";

import styles from "./WeOffer.module.css";

const WeOffer = ({ Data }) => {
  return (
    <div className={styles.Container}>
      <img
        className={styles.bgImg}
        src="/img/MainBg/background.png"
        alt="background image"
      />
      <h2 className={styles.heading}>we offer</h2>
      <div className={styles.Wrapper}>
        {Data.map((item) => (
          <div className={styles.content} key={item.id}>
            <div className={styles.imgWrapper}>
              <img className={styles.img} src={item.image} alt={item.title} />
            </div>
            <div className={styles.info}>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.text}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeOffer;
