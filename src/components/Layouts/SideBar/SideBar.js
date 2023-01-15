import React from "react";
import { useSelector } from "react-redux";

import styles from "./SideBar.module.css";

import ConnectBar from "../../SideBar/ConnectBar/ConnectBar";
import WelcomeBar from "../../SideBar/WelcomeBar/WelcomeBar";
import UserAccBar from "../../SideBar/UserAccBar/UserAccBar";

const SideBar = () => {
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const account = useSelector((state) => state.connect.account);

  return (
    <div className={`${styles.container} ${sideBarOpen && "sideOpen"}`}>
      <div style={{ display: sideBar === "connect" && !account ? "block" : "none" }}>
        <ConnectBar />
      </div>
      {sideBar === "connect" && account && <WelcomeBar />}
      {sideBar === "userAccount" && <UserAccBar />}
      {sideBar === "signIn" && <div>sign in</div>}
    </div>
  );
};

export default SideBar;
