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
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white mt-4 items-center justify-center"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
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
