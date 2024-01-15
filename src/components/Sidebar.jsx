import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { AiFillDashboard } from "react-icons/ai";
import { LuGanttChartSquare } from "react-icons/lu";
import { MdDashboardCustomize } from "react-icons/md";
import { SiBun } from "react-icons/si";
export const Sidebar = ({}) => {
  const { activeMenu, setActiveMenu } = useStateContext();

  const activeLink =
    "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg bg-gray-200 text-md m-2 ";
  const normalLink =
    "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md   dark:hover:text-black hover:bg-white";
  return (
    <div className="ml-3 h-screen absolute w-full md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={() => {
                setActiveMenu(false);
              }}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              {" "}
              <SiBun /> <span>Dashboard</span>
            </Link>
            <TooltipComponent content="Menu" position="ButtomCenter">
              <button
                onClick={() =>
                  setActiveMenu((prevAvtiveMenu) => !prevAvtiveMenu)
                }
                type="Button"
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            <div className=" m-3 mt-4 uppercase">
            
              <NavLink
                to={`/`}
                key={"Dashboard"}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? isActive : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AiFillDashboard className="mt-0.5 text-xl"/>
                <span className="capitalize ">Dashboard</span>
              </NavLink>
              <NavLink
                to={`/editchart`}
                key={"Editchart"}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? isActive : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
     
                <LuGanttChartSquare className="mt-0.5 text-xl"/>
                <span className="capitalize ">Create chart</span>
              </NavLink>
              <NavLink
                to={`/editdash`}
                key={"Editdash"}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? isActive : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
     
                <MdDashboardCustomize className="mt-0.5 text-xl"/>
                <span className="capitalize ">Add/Edit dashboard</span>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
