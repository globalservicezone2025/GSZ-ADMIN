import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import fetchData from "../libs/api";
import { createLogin, isLoggedIn } from "../libs/auth";
import { isValidEmail } from "../utils/isValidEmail";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import "./css/login.css";

const Login = () => {
  const router = useHistory();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const Error = (text) =>
    !text ? null : (
      <p
        style={{
          color: "red",
          fontSize: "14px",
        }}
      >
        {text}
      </p>
    );

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  const initializeApi = async () => {
    // setLoading(true);
    // setEmailError("");
    const jsonData = await fetchData("/", "GET");

    console.log({ jsonData });

    const message = jsonData.message;

    if (!jsonData.success) {
      // eslint-disable-next-line no-throw-literal
      // setLoading(false);
      showErrorToast(jsonData?.message);
      throw {
        message,
      };
    }

    // showSuccessToast(jsonData.message);
    // setLoading(false);

    return { success: true, message: message };
    // }
  };

  // useEffect(() => {
  //   initializeApi();
  // }, []);

  useEffect(() => {
    const init = async () => {
      if (showOtp) {
        // setTimeout(async () => {
        await fetchData(`/auth/login-with-otp`, "POST", {
          // roleId: "roleId",
          email,
          otp: "1234",
        });
        // }, 1000);
      }
    };

    init();
  }, [showOtp]);

  const handelSubmitEmail = async (email) => {
    setLoading(true);

    if (!isValidEmail(email)) {
      setEmailError("Email is invalid!");
      return;
    } else {
      setEmailError("");
      // await fetchData("/api/v1/auth/send-login-otp", "POST", {
      //   email,
      // });

      const jsonData = await fetchData("/api/v1/auth/send-login-otp", "POST", {
        email,
        type: "admin",
      });

      const message = jsonData.message;

      if (!jsonData.success) {
        // eslint-disable-next-line no-throw-literal
        setLoading(false);
        showErrorToast(jsonData?.message);
        throw {
          message,
        };
      }

      setOtp("");
      setShowOtp(true);
      showSuccessToast(jsonData.message);
      setLoading(false);

      // setTimeout(async () => {
      //   await fetchData(`/auth/login-with-otp`, "POST", {
      //     // roleId: "roleId",
      //     email,
      //     otp,
      //   });
      // }, 1000);

      return { success: true, message: message };
    }
  };

  const handelSubmitOtp = async (email, otp) => {
    setLoading(true);

    if (otp.length === 0) {
      setOtpError("Otp is empty!");
      return;
    } else {
      setOtpError("");
      const jsonData = await fetchData("/api/v1/auth/login-with-otp", "POST", {
        email,
        otp,
      });

      const message = jsonData.message;
      if (!jsonData.success) {
        setLoading(false);
        showErrorToast(jsonData?.message);
        // eslint-disable-next-line no-throw-literal
        throw {
          message,
        };
      }
      createLogin(
        jsonData.data.id,
        jsonData.data.roleId,
        jsonData.data.email,
        jsonData.data.accessToken
      );

      showSuccessToast(jsonData.message);
      // router.push("/dashboard");
      window.location.href = "/dashboard";
      setLoading(false);

      return { success: true, message: message };
    }
  };

  return (
    <>
      <div className="authincation h-100" style={{ background: "#294747" }}>
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <h3 className="text-center mb-4 text-white">
                        Voltech Dashboard
                      </h3>
                      <form className="mt-4">
                        {showOtp ? (
                          <>
                            <div className="form-group">
                              <label htmlFor="otp" className="mb-1 text-white">
                                <strong>OTP</strong>
                              </label>
                              <input
                                type="text"
                                id="otp"
                                name="otp"
                                className="form-control"
                                value={otp}
                                onChange={(e) =>
                                  setOtp(parseInt(e.target.value))
                                }
                              />
                              {Error(otpError)}
                              <p className="text-white mt-2">
                                Did not get otp?{" "}
                                {loading ? (
                                  <span style={{ cursor: "pointer" }}>
                                    Sending...
                                  </span>
                                ) : (
                                  <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handelSubmitEmail(email)}
                                  >
                                    Send again
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="text-center login_btn_div">
                              {loading ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn bg-white text-primary btn-block"
                                    // onClick={() => handelSubmitOtp()}
                                  >
                                    Loading...
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn bg-white text-primary btn-block"
                                    onClick={() => handelSubmitOtp(email, otp)}
                                  >
                                    Login
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="form-group">
                              <label
                                htmlFor="email"
                                className="mb-1 text-white"
                              >
                                <strong>Email</strong>
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              {Error(emailError)}
                            </div>
                            <div className="text-center login_btn_div">
                              {loading ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn bg-white text-primary btn-block"
                                    // onClick={() => handelSubmitEmail()}
                                  >
                                    Loading...
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn bg-white text-primary btn-block"
                                    onClick={() => handelSubmitEmail(email)}
                                  >
                                    Send OTP
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
