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
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

<<<<<<< HEAD

=======
  // useEffect(() => {
>>>>>>> d6ecd60a99d3c8bbab7691d5f33d62da2dd1631c
  //   initializeApi();
  // }, []);

  // useEffect(() => {
  //   const init = async () => {
  //     if (showOtp) {
  //       // setTimeout(async () => {
  //       await fetchData(`/auth/login-with-otp`, "POST", {
  //         // roleId: "roleId",
  //         email,
  //         otp: "1234",
  //       });
  //       // }, 1000);
  //     }
  //   };

  //   init();
  // }, [showOtp]);

  const handleSubmitLogin = async (email, password) => {
    setLoading(true);

    let hasError = false;
    if (!isValidEmail(email)) {
      setEmailError("Email is invalid!");
      hasError = true;
    } else {
      setEmailError("");
    }
    if (!password || password.length < 4) {
      setPasswordError("Password is required!");
      hasError = true;
    } else {
      setPasswordError("");
    }
    if (hasError) {
      setLoading(false);
      return;
    }

    const jsonData = await fetchData("/api/v1/auth/login", "POST", {
      email,
      password,
    });

    const message = jsonData.message;
    if (!jsonData.success) {
      setLoading(false);
      showErrorToast(jsonData?.message);
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
    window.location.href = "/dashboard";
    setLoading(false);

    return { success: true, message: message };
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
                        Global Service Zone Dashboard
                      </h3>
                      <form
                        className="mt-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmitLogin(email, password);
                        }}
                      >
                        <div className="form-group">
                          <label htmlFor="email" className="mb-1 text-white">
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
                        <div className="form-group">
                          <label htmlFor="password" className="mb-1 text-white">
                            <strong>Password</strong>
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          {Error(passwordError)}
                        </div>
                        <div className="text-center login_btn_div">
                          {loading ? (
                            <button
                              type="button"
                              className="btn bg-white text-primary btn-block"
                            >
                              Loading...
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn bg-white text-primary btn-block"
                            >
                              Login
                            </button>
                          )}
                        </div>
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
