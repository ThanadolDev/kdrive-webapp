import logo from "./logo.svg";
import "./App.css";
import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Button,Chartsheader,Footer,Header,Navbar,Sidebar,UserProfile,Modals } from "./components";

import { MainDrive } from "./pages";
import { useStateContext} from './contexts/ContextProvider'

function App() {
  const {activeMenu} = useStateContext();
  const [fetchstate, setfetchstate] = useState(false)

  function fetchheader (){
    setfetchstate(!fetchstate)
  }

  return (
    <BrowserRouter>
      <div className="flex relative dark:bg-main-dark-db">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          {/* <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bd-light-gray text-white "
              style={{
                background: "blue",
                borderRadius: "50%",
              }}
            >
              <IoMdAdd />
            </button>
          </TooltipComponent> */}
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bf-secondary-dark-bg bg-white">
             <Sidebar fetchheader={fetchheader}/>
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg"><Sidebar/></div>
        )}
        <div
          className={
            activeMenu
              ? "dark:bg-main-bg bg-main-bg min-h-screen md:ml-72 w-full"
              : "dark:bg-main-bg bg-main-bg min-h-screen w-full flex-2"
          }
        >
          
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
          
          <div>
            <Routes>
              <Route path="/" element={<MainDrive fetchstate={fetchstate}/>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
