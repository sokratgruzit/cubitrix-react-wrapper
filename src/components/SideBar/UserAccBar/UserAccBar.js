import React, { useState } from "react";
import styles from "./UserAccBar.module.css";
import { CloseCircle } from "../../../assets/svg";
import { useDispatch } from "react-redux";

const UserAccBar = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("data");

  const handleClose = () => {
    dispatch({ type: "SET_SIDE_BAR", payload: { sideBarOpen: false } });
  };
  return (
    <>
      <header className={styles.header}>
        <h3>Connect Your Wallet</h3>
        <span className={styles.close} onClick={handleClose}>
          <CloseCircle />
        </span>
      </header>
      <div className={styles.tabsWrapper}>
        <div onClick={() => setSelectedTab("data")}>Personal data</div>
        <div onClick={() => setSelectedTab("security")}>Security</div>
      </div>
      {selectedTab === "data" && <div>full name</div>}
      {selectedTab === "security" && <div>password</div>}
    </>
  );
};

export default UserAccBar;
