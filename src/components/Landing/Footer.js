import Logo from "../../assets/svg/Logo";

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

        </div>
      </div>


    )
};

export default Footer;