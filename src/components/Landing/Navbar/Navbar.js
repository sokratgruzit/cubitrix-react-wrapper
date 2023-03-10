import Logo from "../../../assets/svg/Logo";

import styles from "./Navbar.module.css";

function Navbar({ handleLaunchApp }) {
  return (
    <div className={styles.navBar}>
      <div className={styles.logo}>
        <div>
          <Logo />
        </div>
        <span>COMPLAND</span>
      </div>
      <div className={styles.btn}>
        <button onClick={handleLaunchApp}>Lounch App</button>
      </div>
    </div>
  );
}

export default Navbar;
