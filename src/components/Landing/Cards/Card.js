import React from "react";

import styles from "./Card.module.css";

const Card = ({ Card }) => {
  return (
    <div className={styles.cardContent}>
      <h2 className={styles.heading}>why complend?</h2>
      <div className={styles.cardsWrapper}>
        {Card.map((card) => (
          <div className={styles.card} key={card.id}>
            <div className={styles.imgWrapper}>
              <img className={styles.img} src={card.image} alt={card.title} />
            </div>
            <div className={styles.cardInfo}>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardText}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
