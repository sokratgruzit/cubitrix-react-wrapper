import Logo from "../../../assets/svg/Logo";
import FaceBook from "../../../assets/svg/FaceBook";
import Linkedin from "../../../assets/svg/Linkedin";
import Twitter from "../../../assets/svg/Twitter";
import GitHub from "../../../assets/svg/GitHub";

import styles from "./Footer.module.css";

const Footer =() => {
    return (
        <div className={styles.container}>
        <div className={styles.left}>
          <div>
            <Logo />
          </div>
          <span>COMPLAND</span>
        </div>
        <div className={styles.middle}>
              <input type="text" name="" placeholder="Enter email adress"/>
              <button>Subscribe News</button>
        </div>
        <div className={styles.right}>
            <div className={styles.border}><FaceBook/></div>
            <div className={styles.border}><Twitter/></div>
            <div className={styles.border}><Linkedin/></div>
            <div className={styles.noBorder}><GitHub/></div>
        </div>
      </div>


    )
};

export default Footer;