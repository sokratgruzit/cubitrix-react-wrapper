import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@cubitrix/cubitrix-react-ui-module";

import styles from "./Header.module.css";
import { Dashboard, Extensions, Loan, Trade, MetaMask } from "../../../assets/svg";
import Notifications from "../../../assets/svg/Notifications";

const Header = () => {
  const exts = useSelector((state) => state.extensions.activeExtensions);
  const sideBarOpen = useSelector((state) => state.appState.sideBarOpen);
  const sideBar = useSelector((state) => state.appState.sideBar);
  const account = useSelector((state) => state.connect.account);
  const isConnected = useSelector((state) => state.connect.isConnected);
  const location = useLocation();
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

  const handleNotifications = () => {
    if (sideBarOpen && sideBar !== "notifications") {
      return dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBar: "notifications" },
      });
    }

    dispatch({
      type: "SET_SIDE_BAR",
      payload: { sideBarOpen: !sideBarOpen, sideBar: "notifications" },
    });
  };

  return (
    <div className={`${styles.container} header`}>
      <div className={styles.modulesWrapper}>
        <NavLink
          className={`${location.pathname === "/" && styles.active} ${styles.link}`}
          to="/"
        >
          <Dashboard className={styles.svg} /> Dashboard
        </NavLink>
        {exts.trade === "true" && (
          <NavLink
            className={`${location.pathname === "/trade" && styles.active} ${
              styles.link
            }`}
            to="/trade"
          >
            <Trade className={styles.svg} /> Trade
          </NavLink>
        )}
        {exts.loan === "true" && (
          <NavLink
            className={`${location.pathname === "/loan" && styles.active} ${styles.link}`}
            to="/loan"
          >
            <Loan className={styles.svg} />
            Loan
          </NavLink>
        )}
        {exts.referal === "true" && (
          <NavLink
            className={`${location.pathname === "/referal" && styles.active} ${
              styles.link
            }`}
            to="/referal"
          >
            referal
          </NavLink>
        )}
        {exts.staking === "true" && (
          <NavLink
            className={`${location.pathname === "/staking" && styles.active} ${
              styles.link
            }`}
            to="/staking"
          >
            staking
          </NavLink>
        )}
        <NavLink
          className={`${location.pathname === "/extensions" && styles.active} ${
            styles.link
          }`}
          to="/extensions"
        >
          <Extensions className={styles.svg} />
          Extensions
        </NavLink>
        <NavLink
          className={`${location.pathname === "/auth" && styles.active} ${styles.link}`}
          to="/auth"
        >
          2fa
        </NavLink>
      </div>
      <div className={styles.right}>
        {exts.notify === "true" && (
          <span
            onClick={handleNotifications}
            className={`${
              sideBar === "notifications" && sideBarOpen && styles.activeNotify
            } ${styles.notify}`}
          >
            <Notifications className={styles.notificationSvg} />
          </span>
        )}
        <div className={styles.connect}>
          {account || isConnected ? (
            <Button
              label={
                <span className={styles.addressWrapper}>
                  <MetaMask className={styles.MetaMask} />
                  <p className={styles.address}>{account}</p>
                </span>
              }
              onClick={handleConnect}
              type="btn-secondary"
              element="button"
              size="btn-sm"
              arrow="arrow-right"
              // customStyles={{
              //   maxWidth: "150px",
              // }}
            />
          ) : (
            <>
              <Button
                element="button"
                label="Connect"
                onClick={handleConnect}
                type="btn-primary"
                size="btn-sm"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
