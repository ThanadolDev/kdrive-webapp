import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { AiFillDashboard } from "react-icons/ai";
import { SiProtondrive } from "react-icons/si";
import { ImOnedrive } from "react-icons/im";
import { IoAddOutline } from "react-icons/io5";
import axios from "axios";

export const Sidebar = ({fetchheader}) => {
  const {
    activeMenu,
    setActiveMenu,
    openModal,
    closeModal,
    setUploadProgress,
    uploadProgress,
  } = useStateContext();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("upload", file);
    try {
      const response = await axios.post(
        "http://localhost:7870/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const FormDataDetail2 = {
        Folder: null,
        data: response.data[0],
        EMP_ID: localStorage.getItem("EMP_ID"),
      };
      await axios.post("http://localhost:5000/uploadfiles", FormDataDetail2);
      fetchheader()
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file: ", error);
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
          <div className="flex justify-between items-center">
            <Link
              to="/"
              // onClick={() => {
              //   setActiveMenu(false);
              // }}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              {" "}
              <ImOnedrive /> <span>KDrive</span>
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
              <div className="flex cursor-pointer hover:drop-shadow-xl item-center gap-2 pl-4 pt-3 pb-2.5 rounded-lg bg-white text-md m-2 drop-shadow-md w-[140px]">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="flex items-center w-full gap-5"
                >
                  <IoAddOutline className="text-xl" />
                  <div>Add file</div>
                </label>
              </div>
              <NavLink
                to={`/`}
                key={"Drive"}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? isActive : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiProtondrive className="mt-0.5 text-xl" />
                <span className="capitalize ">Drive</span>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
