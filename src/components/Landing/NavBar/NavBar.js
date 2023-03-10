import Logo from "../../../assets/svg/Logo";

import styles from "./NavBar.module.css";

function NavBar(props) {
 
  const handleButtonClick = () => {
    props.handleButtonClick(" navbar Button clicked");
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.logo}>
        <div>
          <Logo />
        </div>
        <span>COMPLAND</span>
      </div>
      <div className={styles.btn}>
        <button onClick={handleButtonClick}>Lounch Up</button>
      </div>
    </div>
  );
}

export default NavBar;
