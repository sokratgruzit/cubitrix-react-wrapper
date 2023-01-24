import React, { useState } from "react";
import styles from "./UserAccBar.module.css";
import { CloseCircle } from "../../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@brilliant_emporium/ui";

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
          <div className={styles.inputWrapper}>
            <p>Full Name</p>
            <input
              className={styles.input}
              value={userData.name}
              onChange={(e) => handleUserUpdate(e.target.value, "name")}
              placeholder="Enter Full Name"
            />
          </div>
          <div className={styles.inputWrapper}>
            <p>Email Addresse</p>
            <input
              className={styles.input}
              value={userData.email}
              onChange={(e) => handleUserUpdate(e.target.value, "email")}
              placeholder="Enter email"
            />
          </div>
          <div className={styles.inputWrapper}>
            <p>Mobile Number</p>
            <input
              className={styles.input}
              value={userData.mobile}
              onChange={(e) => handleUserUpdate(Number(e.target.value), "mobile")}
              placeholder="mobile number"
            />
          </div>
          <div className={styles.inputWrapper}>
            <p>Date of Birth</p>
            <input
              className={styles.input}
              // value={userData.date_of_birth}
              // onChange={(e) => handleUserUpdate(e.target.value, "date_of_birth")}
              placeholder="MM/DD/YYYY"
            />
          </div>
          <div className={styles.inputWrapper}>
            <p>Nationality</p>
            <input
              className={styles.input}
              // value={userData.date_of_birth}
              // onChange={(e) => handleUserUpdate(e.target.value, "date_of_birth")}
              placeholder="nationality"
            />
          </div>
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
          <div className={styles.inputWrapper}>
            <p>Current Password</p>
            <input
              className={styles.input}
              value={formData.currentPassword}
              onChange={(e) => handleFormUpdate(e.target.value, "currentPassword")}
              placeholder="current password"
            />
          </div>
          <div className={styles.inputWrapper}>
            <p>New Password</p>
            <input
              className={styles.input}
              value={formData.newPassword}
              onChange={(e) => handleFormUpdate(e.target.value, "newPassword")}
              placeholder="new password"
            />
          </div>
          <div className={styles.inputWrapper}>
            <p>Confirm New Password</p>
            <input
              className={styles.input}
              value={formData.confirmPassword}
              onChange={(e) => handleFormUpdate(e.target.value, "confirmPassword")}
              placeholder="confirm new password"
            />
          </div>
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
