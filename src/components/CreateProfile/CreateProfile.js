import React, { useState } from "react";

import axios from "../../api/axios";

import { useSelector } from "react-redux";

import styles from "./CreateProfile.module.css";

const CreateProfile = () => {
  const account = useSelector((state) => state.connect.account);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "november",
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
      .post("/accounts/update_profile_auth", { ...userData, address: account })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e?.response));
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          value={userData.fullName}
          onChange={(e) => handleUserUpdate(e.target.value, "fullName")}
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
          value={userData.phone}
          onChange={(e) => handleUserUpdate(e.target.value, "phone")}
          placeholder="mobile number"
        />
        <div></div>
        <div></div>

        <button onClick={handleUserSave} className={styles.button}>
          Save
        </button>
      </div>

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
        <button onClick={handleUpdate} className={styles.button}>
          Update
        </button>
      </div>
    </div>
  );
};

export default CreateProfile;
