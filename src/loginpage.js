import React, { useState, useEffect } from "react";
import './LoginPage.css'
import ENV from "./env.dev";
function LoginPage() {
    // const [userData, setUserData] = useState([]);
    // const history = useHistory();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      usr: "",
      pwd: "",
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await fetch(ENV.API_AUTH_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
        //   localStorage.setItem("token", true);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");
          try {
            const verifyresponse = await fetch(
              ENV.API_AUTH_VERIFY,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + accessToken,
                },
              }
            );
            const listofuser = await fetch(
              'https://api.nitisakc.dev/kpass/users',
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + accessToken,
                },
              }
            )
            // window.location.reload();
            const data = await verifyresponse.json();
            const usrlist = await listofuser.json()
            if (verifyresponse) {
              // console.log("Verification success" + verifyresponse);
              localStorage.setItem("User_list", JSON.stringify(usrlist))
              localStorage.setItem("ORG_ID", data.profile[0].ORG_ID)
              localStorage.setItem("EMP_ID", data.profile[0].EMP_ID)
              localStorage.setItem("EMP_FNAME", data.profile[0].EMP_FNAME)
              localStorage.setItem("EMP_LNAME", data.profile[0].EMP_LNAME)
              window.location.reload();
              // history.push('/');
            } else if (response.status === 403) {
              setError("Invalid credentials. Please try again.");
            } else {
              setError("An error occurred during login.");
            }
          } catch (error) {
            console.error("Error:", error);
            setError("An error occurred during login.");
          }
        } else if (response.status === 502) {
          setError("Some thing went wrong. Please try again later.");
        } else {
          console.error("Login failed");
          setError("An error occurred during login.");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred during login.");
      } finally {
        setLoading(false);
      }
    };
  
    // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   if (token == null) {
    //     history.push('/login');
    //   }
    // }, [history]);
  
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="logo-login">
            <div className="ingenilogo">
              <img src="ingenilogo.png" />
            </div>
            <div className="kpasslogo">
              <img src="kpasscopy.png" />
            </div>
          </div>
  
          <div className="login-form-container">
            <form onSubmit={handleLogin} className="login-form">
              <div className="topofform">
                <h1 className="toplogin">Sign in</h1>
                <p className="loginpara">Welcome 👋</p>
              </div>
              <div className="input-field">
                <label className="login-label">
                  Username
                  <input
                    type="text"
                    name="usr"
                    className="textarea"
                    placeholder="E.g. 001100, Por"
                    value={formData.usr}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="input-field">
                <label>
                  Password
                  <input
                    type="password"
                    name="pwd"
                    className="textarea"
                    placeholder="Enter your password"
                    value={formData.pwd}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button className="login-button" type="submit" disabled={loading}>
                {loading ? (
                  <div className="loading-circle"></div>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  export default LoginPage;