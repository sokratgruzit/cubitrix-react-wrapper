import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";

import { Logo, Verify, NotVerify } from "../../assets/svg";

import { Button, HelpText } from "@cubitrix/cubitrix-react-ui-module";
import styles from "./VerifyEmail.module.css";

const VerifyEmail = () => {
  const account = useSelector((state) => state.connect.account);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [emailWasSent, setEmailWasSent] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateState = async (callback) => {
    await axios
      .post("/api/accounts/get_account", {})
      .then((res) => {
        let exts1 = res.data.data?.accounts?.[0].extensions;
        if (res.data.data?.accounts?.[0]?.active) {
          exts1.dashboard = "true";
        }

        dispatch({
          type: "SET_USER_DATA",
          payload: res.data.data.accounts[0],
        });
        dispatch({
          type: "UPDATE_ACTIVE_EXTENSIONS",
          payload: exts1,
        });
        dispatch({
          type: "SET_EXTENSIONS_LOADED",
          payload: true,
        });
        dispatch({
          type: "SET_ACCOUNTS_DATA",
          payload: res.data.data.accountBalances,
        });
        if (callback) callback();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const verify = () => {
    setLoading(true);
    axios
      .post("/api/accounts/verify", { code: id })
      .then((res) => {
        updateState();
        setData(JSON.parse(res?.data?.success));
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((e) => {
        setData(JSON.parse(e.response.data.success));
        setLoading(false);
      });
  };

  const resendEmail = () => {
    setLoading(true);
    setEmailWasSent(null);

    axios
      .post("/api/accounts/resend-email", { address: account })
      .then((res) => {
        updateState();
        setEmailWasSent({ success: true, message: res.data });
        setLoading(false);
        setTimeout(() => {
          setEmailWasSent(null);
        }, 3000);
      })

      .catch((e) => {
        setEmailWasSent({ success: false, message: e?.response?.data });
        setLoading(false);
        setTimeout(() => {
          setEmailWasSent(null);
        }, 3000);
      });
  };

  useEffect(() => {
    verify();
    // eslint-disable-next-line
  }, [id]);

  const handleClick = () => {
    resendEmail();
  };

  return (
    <div className={styles.verifyEmailContainer}>
      <div className={styles.logoContainer}>
        <Logo />
        <h2>ATAR</h2>
      </div>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner} />
        </div>
      ) : (
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
          {!data && (
            <Button
              element="button"
              label={"Resend Verification"}
              onClick={handleClick}
              type="btn-primary"
              size="btn-sm"
              // customStyles={{ background: "#00C6FF" }}
            />
          )}
          {data && (
            <HelpText
              status={"success"}
              title={"Email verified successfully, redirecting..."}
              fontSize={"font-12"}
              icon={true}
            />
          )}
          {emailWasSent && (
            <HelpText
              status={emailWasSent.success ? "success" : "error"}
              title={emailWasSent.message}
              fontSize={"font-12"}
              icon={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
