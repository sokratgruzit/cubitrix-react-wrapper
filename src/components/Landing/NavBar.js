import Logo from "../../assets/svg/Logo";

import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          <Logo />
        </div>
        <span>COMPLAND</span>
      </div>
      <div className={styles.right}>
        <button>Lounch Up</button>
      </div>
    </div>
  );
}

export default NavBar;
