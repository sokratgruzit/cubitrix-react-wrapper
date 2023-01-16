import React, { useState } from "react";
import styles from "./UserAccBar.module.css";
import { CloseCircle } from "../../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@cubitrix/cubitrix-react-ui-module";

import axios from "../../../api/axios";

const UserAccBar = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("data");

  const account = useSelector((state) => state.connect.account);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    date_of_birth: Date.now(),
    nationality: "UK",
    avatar: "string",
  });
  const handleFormUpdate = (value, field) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleUserUpdate = (value, field) => {
    setUserData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleUpdate = () => {
    axios
      .post("/accounts/update_profile_auth", { ...formData, address: account })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e?.response));
  };

  const handleUserSave = () => {
    axios
      .post("/accounts/update_profile", { ...userData, address: account })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e?.response));
  };

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
        <div className={styles.tabsWrap}>
          <div
            className={selectedTab === "data" ? styles.selected : ""}
            onClick={() => setSelectedTab("data")}
          >
            Personal data
          </div>
          <div
            className={selectedTab === "security" ? styles.selected : ""}
            onClick={() => setSelectedTab("security")}
          >
            Security
          </div>
        </div>
      </div>
      {selectedTab === "data" && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            value={userData.name}
            onChange={(e) => handleUserUpdate(e.target.value, "name")}
            placeholder="full name"
          />
          <input
            className={styles.input}
            value={userData.email}
            onChange={(e) => handleUserUpdate(e.target.value, "email")}
            placeholder="email address"
          />
          <input
            className={styles.input}
            value={userData.mobile}
            onChange={(e) => handleUserUpdate(e.target.value, "mobile")}
            placeholder="mobile number"
          />
          <input
            className={styles.input}
            // value={userData.date_of_birth}
            // onChange={(e) => handleUserUpdate(e.target.value, "date_of_birth")}
            placeholder="date of birth"
          />
          <input
            className={styles.input}
            // value={userData.date_of_birth}
            // onChange={(e) => handleUserUpdate(e.target.value, "date_of_birth")}
            placeholder="nationality"
          />
          <div>upload image</div>
          <Button
            element="button"
            label="Save"
            type="btn-primary"
            size="btn-sm"
            customStyles={{ width: "100%" }}
            onClick={handleUserSave}
          />
        </div>
      )}
      {selectedTab === "security" && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            value={formData.currentPassword}
            onChange={(e) => handleFormUpdate(e.target.value, "currentPassword")}
            placeholder="current password"
          />
          <input
            className={styles.input}
            value={formData.newPassword}
            onChange={(e) => handleFormUpdate(e.target.value, "newPassword")}
            placeholder="new password"
          />
          <input
            className={styles.input}
            value={formData.confirmPassword}
            onChange={(e) => handleFormUpdate(e.target.value, "confirmPassword")}
            placeholder="confirm new password"
          />
          <Button
            element="button"
            label="Update"
            type="btn-primary"
            size="btn-sm"
            customStyles={{ width: "100%" }}
            onClick={handleUpdate}
          />
        </div>
      )}
    </>
  );
};

export default UserAccBar;
