import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@cubitrix/cubitrix-react-ui-module";

import styles from "./Header.module.css";

const Header = () => {
  const exts = useSelector((state) => state.extensions.activeExtensions);
  const balance = useSelector((state) => state.connect.balance);
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const account = useSelector((state) => state.connect.account);

  const dispatch = useDispatch();

  const handleConnect = () => {
    if (sideBarOpen) {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen },
      });
    } else {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: !sideBarOpen, sideBar: "connect" },
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <p>Logo</p>
      </div>
      <div className={styles.center}>
        <Link className={styles.link} to="/">
          Dashboard
        </Link>
        <Link
          style={{ display: exts.trade === "true" ? "block" : "none" }}
          className={styles.link}
          to="/trade"
        >
          Trade
        </Link>
        <Link
          style={{ display: exts.loan === "true" ? "block" : "none" }}
          className={styles.link}
          to="/loan"
        >
          Loan
        </Link>
        <Link
          style={{ display: exts.referal === "true" ? "block" : "none" }}
          className={styles.link}
          to="/referal"
        >
          Referal
        </Link>
        <Link
          style={{ display: exts.staking === "true" ? "block" : "none" }}
          className={styles.link}
          to="/staking"
        >
          Staking
        </Link>
        <Link className={styles.link} to="/extensions">
          Extensions
        </Link>
        <Link className={styles.link} to="/auth">
          2fa
        </Link>
      </div>
      <div className={styles.right}>
        <p style={{ display: exts.notify === "true" ? "block" : "none" }}>notify</p>
        <p>{balance}</p>
        <div>
          {account ? (
            <Button
              label={<p className={styles.address}>{account}</p>}
              onClick={handleConnect}
              type="btn-secondary"
              size="btn-sm"
              customStyles={{
                maxWidth: "150px",
                // overflow: "hidden",
                // whiteSpace: "nowrap",
                // display: "block",
                // textOverflow: "ellipsis",
                // paddingTop: "10px",
              }}
            />
          ) : (
            <Button
              label="Connect"
              onClick={handleConnect}
              type="btn-primary"
              size="btn-sm"
            />
          )}
          <Link className={styles.link} to="/recovery">
            Recovery Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
