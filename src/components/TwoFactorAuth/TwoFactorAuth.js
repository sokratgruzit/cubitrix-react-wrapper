import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import QRCode from "qrcode";
import axios from "../../api/axios";

import styles from "./TwoFactorAuth.module.css";

const TwoFactorAuth = () => {
    const address = useSelector(state => state.connect.account);
    const [ qrcodeUrl, setqrCodeUrl ] = useState("");
    const { register, handleSubmit, watch, formState: { errors }, setFocus } = useForm();
    const [ base32, setBase32 ] = useState("");
    const [ otpauthUrl, setOtpAuthUrl ] = useState("");
    
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
            if (address !== undefined) {
                await axios.post("/accounts/otp/generate", { address }).then(res => {
                    const { base32, otpauth_url } = res.data;
                    setBase32(base32);
                    setOtpAuthUrl(otpauth_url);
                }).then(() => {
                    QRCode.toDataURL(otpauthUrl).then(setqrCodeUrl);
                });
            }
        }

        generateOtp();
    }, [address]);
    
    useEffect(() => {
        setFocus("token");
    }, [setFocus]);

    return (
        <div className={styles.container}>
            <div className={styles.modalWrap}>
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
                                className={styles.buttonGrey}
                            >
                                Close
                            </button>
                            <button type="submit" className={styles.buttonBlue}>
                                Verify & Activate
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuth;