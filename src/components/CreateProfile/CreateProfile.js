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
  const handleFormUpdate = (value, field) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleUpdate = () => {
    console.log(formData);
    axios
      .post("/accounts/update_profile_auth", { ...formData, address: account })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e?.response));
  };

  return (
    <div className={styles.container}>
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
  );
};

export default CreateProfile;
