import { useRef, useState, useEffect, useContext } from "react";

import axios from "./api/axios";
const FORGOT_PASSWORD_URL = "/api/v1/users/forgotPassword";

const ForgotPassword = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        FORGOT_PASSWORD_URL,
        JSON.stringify({ emp_email: user }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(JSON.stringify(response?.data));

      setUser("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 429) {
        setErrMsg("Too Many Requests");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Password Reset Link Sent to the Mail</h1>
          <br />
          <p>
            <a href="https://mail.google.com/mail/u/0/#inbox">Open mail</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="userEmail">Email:</label>
            <input
              type="email"
              id="userEmail"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <button>Reset Password</button>
          </form>
        </section>
      )}
    </>
  );
};

export default ForgotPassword;
