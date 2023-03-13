import { ResetPasswordForm } from "@cubitrix/cubitrix-react-ui-module";
import axios from "axios";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState({ loading: false, error: "", success: "" });

  const handlePasswordSetup = (data) => {
    setStatuses({ loading: true, error: "", success: "" });
    axios
      .post("/api/accounts/reset-password", {
        code: params.code,
        password: data.newPassword,
      })
      .then((res) => {
        if (res.data === "password updated") {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        setStatuses({ loading: false, error: "", success: res.data });
      })
      .catch((e) => {
        setStatuses({ loading: false, error: e.response?.data, success: "" });
      });
  };

  return (
    <div className={`container ${styles.passwordResetContainer}`}>
      <div style={{ width: "400px" }}>
        <ResetPasswordForm
          passwordSetUpState={statuses}
          handleNewPassword={handlePasswordSetup}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
