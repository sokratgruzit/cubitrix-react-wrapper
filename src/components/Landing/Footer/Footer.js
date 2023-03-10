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
        <div className={styles.footer}>
        <div className={styles.logo}>
          <div>
            <Logo />
          </div>
          <span>COMPLAND</span>
        </div>
        <div className={styles.form}>
              {/* <form> */}
              <input type="text" name="" placeholder="Enter email adress" value={inputValue} onChange={handleChange}/>
              <button type="submit" onClick={handleButtonClick} >Subscribe News</button>
              {/* </form> */}
        </div>
        <div className={styles.icons}>
            <div className={styles.border}><FaceBook/></div>
            <div className={styles.border}><Twitter/></div>
            <div className={styles.border}><Linkedin/></div>
            <div className={styles.noBorder}><GitHub/></div>
        </div>
      </div>


    )
};

export default Footer;