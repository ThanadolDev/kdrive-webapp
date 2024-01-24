import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { AiFillDashboard } from "react-icons/ai";
import { SiProtondrive } from "react-icons/si";
import { ImOnedrive } from "react-icons/im";
import { IoAddOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { FaSlideshare } from "react-icons/fa";

import axios from "axios";
// const pathurl = `http://localhost`;
const pathurl = `http://192.168.55.37`;
export const Sidebar = ({ fetchheader }) => {
  const {
    activeMenu,
    setActiveMenu,
    openModal,
    closeModal,
    setUploadProgress,
    uploadProgress,
    folderhistory,
    currentParams
  } = useStateContext();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    console.log(currentParams)
    formData.append("upload", file);
    try {
      const response = await axios.post(
        `${pathurl}:7870/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(percentCompleted);
            setUploadProgress(percentCompleted);
          },
        }
      );
      setUploadProgress(0);
      const FormDataDetail2 = {
        Folder: currentParams ? currentParams : null,
        data: response.data[0],
        EMP_ID: localStorage.getItem("EMP_ID"),
      };
      await axios.post(`${pathurl}:7871/uploadfiles`, FormDataDetail2);
      fetchheader();
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file: ", error);
      window.alert(error);
      setUploadProgress(0);
    }
  };

  const activeLink =
    "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg bg-gray-200 text-md m-2 ";
  const normalLink =
    "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md   dark:hover:text-black hover:bg-white";
  return (
    <div className=" h-screen absolute w-full md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-white drop-shadow-sm">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center ml-2">
           
            <Link
              to="/"
              // onClick={() => {
              //   setActiveMenu(false);
              // }}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              {" "}
              <ImOnedrive className="text-blue-700" /> <span>KDrive</span>
            </Link>
            <TooltipComponent content="Menu" position="ButtomCenter">
              <button
                onClick={() =>
                  setActiveMenu((prevAvtiveMenu) => !prevAvtiveMenu)
                }
                type="Button"
                className="text-xl mr-2 rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel className="text-xl"/>
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            <div className=" m-3 mt-4 uppercase">
              {/* {uploadProgress !== 100 ? (
                <div className="flex cursor-pointer hover:drop-shadow-xl hover:bg-gray-200 item-center gap-2 pl-4 pt-3 pb-2.5 rounded-lg bg-white text-md m-2 mb-4 drop-shadow-md w-[140px]">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden cursor-pointer"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex items-center cursor-pointer w-full gap-5"
                  >
                    <IoAddOutline className="text-xl text-blue-700" />
                    <div>New</div>
                  </label>
                </div>
              ) : (
                <div className="flex cursor-pointer hover:drop-shadow-xl hover:bg-gray-200 item-center gap-2 pl-4 pt-3 pb-2.5 rounded-lg bg-white text-md m-2 drop-shadow-md w-[140px]">
                  <div
                    class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                  <div>Loading</div>
                </div>
              )} */}
              <NavLink
                to={`/Drive`}
                key={"Drive"}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? isActive : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiProtondrive className="mt-0.5 text-xl text-blue-700" />
                <span className="capitalize ">Drive</span>
              </NavLink>
              <NavLink
                to={`/ShareDrive`}
                key={"ShareDrive"}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? isActive : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <FaSlideshare className="mt-0.5 text-xl text-blue-700" />
                <span className="capitalize ">Share Drive</span>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
