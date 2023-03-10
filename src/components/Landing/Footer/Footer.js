
// svgs
import Logo from "../../../assets/svg/Logo";
import FaceBook from "../../../assets/svg/FaceBook";
import Linkedin from "../../../assets/svg/Linkedin";
import Twitter from "../../../assets/svg/Twitter";
import GitHub from "../../../assets/svg/GitHub";

import styles from "./Footer.module.css";

const Footer =({ email, setEmail, handleSubmit }) => {
  const handleChange = (e) => {
    setEmail(e.target.value);
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
            <input type="text" name="email" placeholder="Enter email adress" value={email} onChange={handleChange}/>
            <button type="submit" onClick={handleSubmit} >Subscribe News</button>
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