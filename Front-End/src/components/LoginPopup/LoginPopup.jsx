
import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPopup({ setShowLogin }) {
  const navigate = useNavigate();
  const { url, token, setToken } = useContext(StoreContext);

  const [currState, SetCurrState] = useState("Login");
  const [otpStep, setOtpStep] = useState(false); // To track if we're in OTP verification step
  const [otpSent, setOtpSent] = useState(false); // To track if OTP has been sent
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const onLogin = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    try {
      // If in OTP step, verify OTP and register
      if (otpStep && currState === "Sign Up") {
        const newUrl = url + "/api/user/register-with-otp";
        const response = await axios.post(newUrl, {
          name: data.name,
          email: data.email,
          password: data.password,
          otp: data.otp,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setShowLogin(false);
          setOtpStep(false);
          setOtpSent(false);
          toast.success("Registration successful! Welcome to TOMATO APP 🎉", {
            position: "top-center",
            autoClose: 3000,
          });
          navigate("/");
        } else {
          toast.error(response.data.message || "OTP verification failed", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } 
      // If sign up but not in OTP step, send OTP
      else if (currState === "Sign Up" && !otpStep) {
        const newUrl = url + "/api/user/send-otp";
        const response = await axios.post(newUrl, {
          email: data.email,
        });

        if (response.data.success) {
          setOtpSent(true);
          setOtpStep(true);
          toast.info("OTP sent to your email! Please check your inbox 📧", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error(response.data.message || "Failed to send OTP", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }
      // Regular login
      else {
        const newUrl = url + "/api/user/login";
        const response = await axios.post(newUrl, {
          email: data.email,
          password: data.password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setShowLogin(false);
          toast.success("Login successful! Welcome back 👋", {
            position: "top-center",
            autoClose: 3000,
          });
          navigate("/");
        } else {
          toast.error(response.data.message || "Login failed", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }
    } catch (err) {
      if (err.response?.data?.message === "jwt expired") {
        toast.error("Session expired. Please log in again.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(err.response?.data?.message || "Something went wrong!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (evt) => {
    setData((prev) => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => {
              setShowLogin(false);
              setOtpStep(false);
              setOtpSent(false);
            }}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {otpStep && currState === "Sign Up" ? (
            // OTP Verification Step
            <>
              <input
                onChange={onChangeHandler}
                name="otp"
                value={data.otp}
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                maxLength="6"
              />
            </>
          ) : currState === "Login" ? (
            // Login Form
            <></>
          ) : (
            // Sign Up Form
            <>
              <input
                onChange={onChangeHandler}
                name="name"
                value={data.name}
                type="text"
                placeholder="Your name"
                required
              />
              <input
                onChange={onChangeHandler}
                name="email"
                value={data.email}
                type="email"
                placeholder="Your email"
                required
              />
              <input
                onChange={onChangeHandler}
                name="password"
                value={data.password}
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}
          {currState === "Login" && (
            <>
              <input
                onChange={onChangeHandler}
                name="email"
                value={data.email}
                type="email"
                placeholder="Your email"
                required
              />
              <input
                onChange={onChangeHandler}
                name="password"
                value={data.password}
                type="password"
                placeholder="Password"
                required
              />
            </>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : 
           otpStep && currState === "Sign Up" ? "Verify OTP & Register" : 
           currState === "Sign Up" ? "Send OTP" : 
           "Login"}
        </button>
        
        {!otpStep && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, i agree to the terms of use & privacy policy. </p>
          </div>
        )}
        
        {!otpStep && (
          <>
            {currState === "Login" ? (
              <p>
                Create a new account?{" "}
                <span onClick={() => {
                  SetCurrState("Sign Up");
                  setData({name: "", email: "", password: "", otp: ""});
                }}>Click here</span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span onClick={() => {
                  SetCurrState("Login");
                  setData({name: "", email: "", password: "", otp: ""});
                }}>Login here</span>
              </p>
            )}
          </>
        )}
        
        {otpStep && (
          <p>
            <span onClick={() => {
              setOtpStep(false);
              setOtpSent(false);
              setData({...data, otp: ""});
            }}>Back to registration</span>
          </p>
        )}
      </form>
    </div>
  );
}
