import React, { useState, useEffect } from "react";
// import './LoginPage.css'
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
          const verifyresponse = await fetch(ENV.API_AUTH_VERIFY, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          });
          const listofuser = await fetch(
            "https://api.nitisakc.dev/kpass/users",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
              },
            }
          );
          // window.location.reload();
          const data = await verifyresponse.json();
          const usrlist = await listofuser.json();
          if (verifyresponse) {
            // console.log("Verification success" + verifyresponse);
            localStorage.setItem("User_list", JSON.stringify(usrlist));
            localStorage.setItem("ORG_ID", data.profile[0].ORG_ID);
            localStorage.setItem("EMP_ID", data.profile[0].EMP_ID);
            localStorage.setItem("EMP_FNAME", data.profile[0].EMP_FNAME);
            localStorage.setItem("EMP_LNAME", data.profile[0].EMP_LNAME);
            window.location.reload();
            // history.push('/');
          } else if (response.status === 403) {
            setError("Username or password is wrong. Please try again.");
          } else {
            setError("Some thing went wrong with login server. Please try again later.");
          }
        } catch (error) {
          console.error("Error:", error);
          
          setError("An error occurred during login.");
        }
      } else if (response.status === 502) {
        setError("Some thing went wrong with login server. Please try again later.");
      } else {
        console.error("Login failed");
        setError("Username or password is wrong. Please try again.");
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
    <div className="login-page flex bg-gray-100  items-center justify-center w-full h-screen">
      <div className="login-container bg-white p-12 rounded-lg  w-[400px] border-2">
        <div className="logo-login  place-content-end flex">
          {/* <div className="ingenilogo">
              <img src="ingenilogo.png" />
            </div> */}
          <div className="kpasslogo ">
            <img src="/kpasscopy.png" />
          </div>
        </div>

        <div className="login-form-container w-full ">
          <form onSubmit={handleLogin} className="login-form">
            <div className="topofform mt-4">
              <h1 className="toplogin text-2xl">Sign in</h1>
              <p className="loginpara ">Welcome 👋</p>
            </div>
            <hr class="my-1 h-0.5 border-t-1 mt-4 bg-neutral-100 opacity-100 dark:opacity-90" />
            <div className="input-field mt-4">
              <div>Username</div>
              <label className="login-label">
                <input
                  type="text"
                  name="usr"
                  className="mt-2 shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="E.g. 001100, Por"
                  value={formData.usr}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="input-field mt-4">
              <div>Password</div>
              <label>
                <input
                  type="password"
                  name="pwd"
                  className="mt-2  shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your password"
                  value={formData.pwd}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            {error && (
              <div className="mt-4 font-bold text-lg text-red-500">{error}</div>
            )}

            {loading ? (
              <div className="flex flex-row-reverse place-content-end mt-4 w-full">
                <button
                  disabled
                  type="button"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white mt-4 items-center justify-center cursor-wait"
                >
                  loading 
                </button>
              </div>
            ) : (
              <div className="flex flex-row-reverse place-content-end mt-4 w-full">
                <button className="" type="submit" disabled={loading}>
                  <div className="mt-8">
                    <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                      Sign in
                    </div>
                  </div>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
