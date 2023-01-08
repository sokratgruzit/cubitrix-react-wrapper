import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "qrcode";
import axios from "../../api/axios";

import styles from "./TwoFactorAuth.module.css";

const TwoFactorAuth = () => {
    const dispatch = useDispatch();
    const address = useSelector(state => state.connect.account);
    const [ qrcodeUrl, setqrCodeUrl ] = useState("");
    const { register, handleSubmit, formState: { errors }, setFocus } = useForm();
    const [ base32, setBase32 ] = useState("");
    const [ openModal, setOpenModal ] = useState(false);
    
    const verifyOtp = async (token) => {
        try {
            await axios.post("/accounts/otp/verify", {
                token,
                address,
            }).then(res => {
                console.log(res);
            });
          
            console.log("Two-Factor Auth Enabled Successfully");
        } catch (error) {
            const resMessage =
            (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.response.data.detail ||
            error.message ||
            error.toString();
          
            console.log(resMessage);
        }
    };
    
    const onSubmitHandler = (values) => {
        verifyOtp(values.token);
    };
    
    useEffect(() => {
        async function generateOtp() {
            try {
                if (address !== undefined && address !== "") {
                    await axios.post("/accounts/otp/generate", { address }).then(res => {
                        const { base32, otpauth_url } = res.data;
                        setBase32(base32);
                        
                        return otpauth_url;
                    }).then((otpauth_url) => {
                        QRCode.toDataURL(otpauth_url).then(setqrCodeUrl);
                    });
                }
            } catch (err) {
                console.log('generate otp error', err);
            }
        }

        generateOtp();
    }, [address]);
    
    useEffect(() => {
        setFocus("token");
    }, [setFocus]);

    return (
        <div className={styles.container}>
            {openModal && <div style={{ display: openModal ? 'block' : 'none' }} className={styles.modalWrap}>
                <h3 className={styles.heading3}>Two-Factor Authentication (2FA)</h3>
                {/* Modal body */}
                <div className={styles.body}>
                    <h4 className={styles.heading4}>
                        Configuring Google Authenticator or Authy
                    </h4>
                    <div className={styles.orderedList}>
                        <li>
                            Install Google Authenticator (IOS - Android) or Authy (IOS -
                            Android).
                        </li>
                        <li>In the authenticator app, select "+" icon.</li>
                        <li>
                            Select "Scan a barcode (or QR code)" and use the phone's camera
                            to scan this barcode.
                        </li>
                    </div>
                    <div>
                        <h4 className={styles.heading4}>Scan QR Code</h4>
                        <div className={styles.gqWrapp}>
                            <img
                                className={styles.qrImg}
                                src={qrcodeUrl}
                                alt="qrcode url"
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className={styles.heading4}>Or Enter Code Into Your App</h4>
                        <p className={styles.p}>SecretKey: {base32} (Base32 encoded)</p>
                    </div>
                    <div>
                        <h4 className={styles.heading4}>Verify Code</h4>
                        <p className={styles.p}>
                            For changing the setting, please verify the authentication code:
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmitHandler)}>
                        <input
                            {...register("token")}
                            className={styles.input}
                            placeholder="Authentication Code"
                        />
                        <p className={styles.err}>
                            {errors.token ? errors.token.message : null}
                        </p>
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={styles.buttonGray}
                                onClick={() => setOpenModal(false)}
                            >
                                Close
                            </button>
                            <button type="submit" className={styles.buttonBlue}>
                                Verify & Activate
                            </button>
                        </div>
                    </form>
                </div>
            </div>}
            {!openModal && <div 
                onClick={() => {
                    if (address === "" || address === undefined) {
                        dispatch({ type: "TOGGLE_WALLET_CONNECT_MODAL", payload: true });
                    } else {
                        setOpenModal(true);
                    }
                }}
                style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "auto",
                    padding: "0 10px",
                    height: "40px",
                    background: "blue",
                    color: "white",
                    top: "300px",
                    left: "calc(50% - 50px)",
                    cursor: "pointer"
                }}
            >{address === "" || address === undefined ? "Connect Wallet" : "Set Up 2FA"}</div>}
        </div>
    );
};

export default TwoFactorAuth;