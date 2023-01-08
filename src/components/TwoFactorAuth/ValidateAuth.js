import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ValidateAuth.module.css";
import { useSelector } from "react-redux";
import axios from "axios";

const ValidateAuth = () => {
    const address = useSelector(state => state.connect.account);
    const otp_enabled = useSelector(state => state.connect.otpEnabled);
    const navigate = useNavigate();

    const {
        handleSubmit,
        setFocus,
        register,
        formState: { errors },
    } = useForm();

    const validate2fa = async (token) => {
        try {
            if (otp_enabled) {
                await axios.post("/accounts/otp/validate", {
                    token,
                    address: address,
                }).then(res => {
                    let otp_valid = res.data.otp_valid;

                    if (otp_valid) {
                        navigate("/dashboard");
                    } else {
                        navigate("/recovery");
                    }
                });
            }
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
        validate2fa(values.token);
    };

    useEffect(() => {
        setFocus("token");
    }, [setFocus]);

    useEffect(() => {
        if (address === undefined || address === "") {
            navigate("/recovery");
        }
    }, []);

    return (
        <div className={styles.body}>
            <h1>Welcome Back</h1>
            <h2>Verify the Authentication Code</h2>
            <form
                onSubmit={handleSubmit(onSubmitHandler)}
                className={styles.form}
            >
            <h2>Two-Factor Authentication</h2>
            <p>
                Open the two-step verification app on your mobile device to get your
                verification code.
            </p>
            <input
                {...register("token")}
                className={styles.input}
                placeholder="Authentication Code"
            />
            <p className={styles.message}>
                {errors.token ? errors.token.message : null}
            </p>
            <button type="submit" className={styles.buttonBlue}>
                Authenticate
            </button>
            <span>
                <Link to="/recovery">
                    Back to basic login
                </Link>
            </span>
            </form>
        </div>
    );
};

export default ValidateAuth;