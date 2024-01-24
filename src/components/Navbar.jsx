import React, { useEffect, useState } from "react";
import { AioutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineMenu } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

export const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    setScreenSize,
    screenSize,
    openrightclickModal,
    setContextMenuPosition,
    rightclickmodal,
    contextMenuPosition,
  } = useStateContext();


  const username =
    localStorage.getItem("EMP_FNAME") + " " + localStorage.getItem("EMP_LNAME");
  const empid = localStorage.getItem("EMP_ID");

  const handleContextMenu = (event) => {
    const keysToRemove = ["EMP_ID", "EMP_LNAME", "EMP_FNAME", "accessToken", "refreshToken", "ORG_ID"];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    window.location.reload();
};


  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);
  return (
    <div className="flex justify-between p-2  relative bg-white drop-shadow-sm w-full">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((preActiveMenu) => !preActiveMenu)}
        color="blue"
        icon={<AiOutlineMenu />}
      ></NavButton>

      <div className="flex   gap-2  items-center">
        <img
          src={`https://api.nitisakc.dev/avatar/${empid}`}
          alt=""
          className="w-[40px] h-[40px] rounded-full"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://th.bing.com/th/id/OIP.DZ96fH-5g3OkZuMwb2Y5rgAAAA?rs=1&pid=ImgDetMain"; 
          }}
        />
        <div>{username}</div>
        <div
          className="hover:bg-gray-100 rounded-xl p-2 cursor-pointer flex gap-2 items-center"
          onClick={(e) => handleContextMenu(e)}
        >
          <IoIosLogOut className="text-xl text-blue-700 font-bold" />
          <div className="font-bold text-blue-700">Logout</div>
        </div>
      </div>
    </div>
  );
};
