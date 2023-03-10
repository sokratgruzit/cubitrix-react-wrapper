import React, { useState } from "react";

import Logo from "../../../assets/svg/Logo";
import FaceBook from "../../../assets/svg/FaceBook";
import Linkedin from "../../../assets/svg/Linkedin";
import Twitter from "../../../assets/svg/Twitter";
import GitHub from "../../../assets/svg/GitHub";

import styles from "./Footer.module.css";

const Footer =(props) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    props.handleInput(value);
  };

  const handleButtonClick = () => {
    props.handleButtonClick("footer Button clicked");
  };

    return (
        <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          {/* <div className={styles.footerWrap}> */}
          <div>
            <Logo />
          </div>
          <span>COMPLAND</span>
        </div>
        <div className={styles.footerForm}>
              {/* <form> */}
              <input type="text" name="" placeholder="Enter email adress" value={inputValue} onChange={handleChange}/>
              <button type="submit" onClick={handleButtonClick} >Subscribe News</button>
              {/* </form> */}
        {/* </div> */}
        </div>
        <div className={styles.footerIcons}>
            <div className={styles.ftIcon}><FaceBook/></div>
            <div className={styles.ftIcon}><Twitter/></div>
            <div className={styles.ftIcon}><Linkedin/></div>
            <div className={styles.ftIconBorder}><GitHub/></div>
        </div>
      </div>


    )
};

export default Footer;