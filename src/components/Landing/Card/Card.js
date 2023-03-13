import React from "react";

import SwiperWrapper from "../SwiperWrapper/SwiperWrapper";

import styles from "./Card.module.css";

const Card = ({ type, data, handleSubmit, customStyles, projectsData }) => {
  let element = null;

  if (type === "default") {
    element = (
      <div className={styles.cardContent} style={customStyles}>
        <h2 className={styles.cardHeader}>why complend?</h2>
        <div className={styles.cardsWrapper}>
          {data.map((item) => (
            <div className={styles.card} key={item.id}>
              <div className={styles.imgWrapper}>
                <img
                  className={styles.cardImg}
                  src={item.image}
                  alt={item.title}
                />
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

  if (type === "about") {
    element = (
      <div style={customStyles}>
        <img
          className={styles.bgImg}
          src="/img/MainBg/background.png"
          alt="background cover"
        />
        <div className={styles.aboutContainer}>
          <h2 className={styles.aboutHeader}>we offer</h2>
          <div className={styles.aboutWrapper}>
            <SwiperWrapper>
              {data.map((item) => (
                <div className={styles.aboutContent} key={item.id}>
                  <div className={styles.aboutImgWrapper}>
                    <img
                      className={styles.aboutImg}
                      src={item.image}
                      alt={item.title}
                    />
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
      </div>
    );
  }

  if (type === "become-member") {
    element = (
      <div className={styles.becomeMemberContainer} style={customStyles}>
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
                <p className={styles.becomeMemberText}>{item.description}</p>
                <p className={styles.becomeMemberText}>{item.description2}</p>
                <button onClick={handleSubmit} className={styles.blueButton}>
                  {item.button}
                </button>
              </div>
              <div className={styles.becomeMemberImgWrapper}>
                <img
                  className={styles.becomeMemberImg}
                  src={item.image}
                  alt={item.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "trading-platform") {
    element = (
      <div className={styles.platformContainer} style={customStyles}>
        {data.map((item) => (
          <div className={styles.platformContent} key={item.id}>
            <img className={styles.platformBgImg} src={item.bgImg} alt="" />
            <div className={styles.platformInfo}>
              <h1 className={styles.platformTitle}>
                world class
                <span className={styles.titleSpan}> trading platform.</span> Buy
                & sell the crypto with
                <span className={styles.titleSpan}> complend.</span>
              </h1>
              <p className={styles.platformText}>{item.description}</p>
              <button onClick={handleSubmit} className={styles.blueButton}>
                {item.button}
              </button>
            </div>
            <div className={styles.platformWrapper}>
              {projectsData.map((item) => (
                <div className={`${styles.platformBox} ${item.active && styles.platformBoxActive}`}>
                  {item.svg}
                  <p>
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return element;
};

export default Card;
