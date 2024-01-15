import React,{useEffect} from "react";
import { AioutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineMenu } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

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
  const { activeMenu, setActiveMenu,setScreenSize,screenSize } = useStateContext();
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
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
      <div className="flex">
        <NavButton
          // title="Menu"
          // customFunc={() => setActiveMenu((preActiveMenu) => !preActiveMenu)}
          color="blue"
          icon={<CgProfile />}
        ></NavButton>
      </div>
    </div>
  );
};
