import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ContextProvider } from "./contexts/ContextProvider";
import LoginPage from "./loginpage";
const root = ReactDOM.createRoot(document.getElementById("root"));
const EMP_ID = localStorage.getItem("EMP_ID");
root.render(
  <ContextProvider>
    {EMP_ID ? <App />  : <LoginPage />}
  </ContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
