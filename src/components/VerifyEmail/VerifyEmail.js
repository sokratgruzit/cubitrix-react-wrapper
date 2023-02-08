import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";

import { Logo, Verify, NotVerify } from "../../assets/svg";

import { Button } from "@cubitrix/cubitrix-react-ui-module";
import styles from "./VerifyEmail.module.css";

const VerifyEmail = (props) => {
  const account = useSelector((state) => state.connect.account);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState();

  const updateState = () => {
    axios
      .post("/accounts/get_account", {
        address: account,
      })
      .then((res) => {
        dispatch({
          type: "SET_USER_DATA",
          payload: res.data.success.data.accounts[0],
        });
      })
      .catch((e) => {});
  };

  const verify = () => {
    axios
      .post("/accounts/verify", { code: params.id })
      .then((res) => {
        updateState();
        setData(JSON.parse(res.data.success));
      })
      .catch((e) => setData(JSON.parse(e.response.data.success)));
  };

  useEffect(() => {
    verify();
  }, [params]);

  const handleClick = () => {
    if (data) {
      dispatch({
        type: "SET_SIDE_BAR",
        payload: { sideBarOpen: true, sideBar: "UserAccount" },
      });
      navigate("/");
    }
    if (!data) {
      setData(undefined);
      verify();
    }
  };
  return (
    <>
      {data === undefined ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner} />
        </div>
      ) : (
        <div className={styles.verifyEmailContainer}>
          <div className={styles.logoContainer}>
            <Logo />
            <h2>COMPLEND</h2>
          </div>
          <div className={styles.emailInfo}>
            {data ? <Verify /> : <NotVerify />}
            <div>
              <h3>{data ? "Verify your Email" : "Email Not Verify"}</h3>
              <p>
                {data ? (
                  "Your email address has been verified. Now you can set up security"
                ) : (
                  <>
                    <span>Your email address hasn’t been verified.</span>
                    <span>
                      Please try again or click on the reset button to receive a new
                      verification mail.
                    </span>
                  </>
                )}
              </p>
            </div>
            <Button
              element="button"
              label={data ? "Set Up Security" : "Resend Verification"}
              onClick={handleClick}
              type="btn-primary"
              size="btn-sm"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyEmail;