import React from "react";

import styles from "./BecomeMember.module.css";

const BecomeMember = ({ Data }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Become member</h2>
      <div className={styles.wrapper}>
        {Data.map((item) => (
          <div className={styles.content} key={item.id}>
            <div className={styles.info}>
              <img
                className={styles.elipse}
                src="/img/BecomeMember/elipse.png"
                alt="/"
              />
              <p className={styles.text}>{item.description}</p>
              <p className={styles.text}>{item.description2}</p>
              <button className={styles.button}>{item.button}</button>
            </div>
            <div className={styles.imgWrapper}>
              <img className={styles.img} src={item.image} alt={item.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BecomeMember;
