import Logo from "../../../assets/svg/Logo";

import styles from "./Footer.module.css";

const Footer = ({ handleSubmit, email, setEmail, data }) => {
  return (
    <div className={styles.footerContent}>
      <div className={styles.footerLogo}>
        <div>
          <Logo />
        </div>
        <span>COMPLAND</span>
      </div>
      <div className={styles.footerForm}>
        <input
          type="text"
          name="email"
          placeholder="Enter email adress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Subscribe News
        </button>
      </div>
      <div className={styles.footerIcons}>
        {data?.map((item, index) => (
          <div className={styles.ftIcon} onClick={item.onClick} key={index}>
            {item.svg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
