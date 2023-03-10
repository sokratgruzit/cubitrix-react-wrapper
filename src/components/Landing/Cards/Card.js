import React from "react";

import SwiperWrapper from "../SwiperWrapper/SwiperWrapper";

import styles from "./Card.module.css";

const Card = ({ type, data }) => {

  let element = null;

  if (type === 'default') {
    element = (
      <div className={styles.cardContent}>
        <h2 className={styles.cardHeader}>why complend?</h2>
        <div className={styles.cardsWrapper}>
          {data.map((item) => (
            <div className={styles.card} key={item.id}>
              <div className={styles.imgWrapper}>
                <img className={styles.cardImg} src={item.image} alt={item.title} />
              </div>
              <div className={styles.cardInfo}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardText}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'about') {
    element = (
      <div className={styles.aboutContainer}>
        <img
          className={styles.bgImg}
          src="/img/MainBg/background.png"
          alt="background image"
        />
        <h2 className={styles.aboutHeader}>we offer</h2>
        <div className={styles.aboutWrapper}>
          <SwiperWrapper>
            {data.map((item) => (
              <div className={styles.aboutContent} key={item.id}>
                <div className={styles.imgWrapper}>
                  <img className={styles.aboutImg} src={item.image} alt={item.title} />
                </div>
                <div className={styles.aboutInfo}>
                  <h2 className={styles.aboutTitle}>{item.title}</h2>
                  <p className={styles.aboutText}>{item.description}</p>
                </div>
              </div>
            ))}
          </SwiperWrapper>
        </div>
      </div>
    );
  }

  if (type === 'become-member') {
    element = (
      <div className={styles.becomeMemberContainer}>
      <h2 className={styles.becomeMemberHeader}>Become member</h2>
      <div className={styles.becomeMemberWrapper}>
        {data.map((item) => (
          <div className={styles.becomeMemberContent} key={item.id}>
            <div className={styles.becomeMemberInfo}>
              <img
                className={styles.elipse}
                src="/img/BecomeMember/elipse.png"
                alt="/"
              />
              <p className={styles.text}>{item.description}</p>
              <p className={styles.text}>{item.description2}</p>
              <button className={styles.button}>{item.button}</button>
            </div>
            <div className={styles.becomeMemberImgWrapper}>
              <img className={styles.img} src={item.image} alt={item.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  }

  return element;
};

export default Card;
