import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CiLock } from "react-icons/ci";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useStateContext } from "../contexts/ContextProvider";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "axios";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

// const pathurl = `http://localhost`;
const pathurl = `http://192.168.55.37`;

const animatedComponents = makeAnimated();

export const UserList = ({ clickedfile }) => {
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userPermissionList, setuserPermissionList] = useState([]);
  const fetchData = async () => {
    const userLocal = JSON.parse(localStorage.getItem("User_list"));
    const secondData = await handleFetchUserPermission();

    const filteredUserList = userLocal.filter((user) => {
      return (
        secondData.find(
          (secondUser) => secondUser.user_id === user.AD_USER_ID
        ) === undefined
      );
    });
    setUserList(
      filteredUserList.map((user) => ({
        label: `${user.EMP_FNAME} ${user.EMP_LNAME}`,
        Fname: `${user.EMP_FNAME}`,
        Lname: `${user.EMP_LNAME}`,
        value: user.AD_USER_ID,
        user_id: user.AD_USER_ID,
        ORG_ID: user.ORG_ID,
      }))
    );
    const secondDataWithDetails = secondData.map((secondUser) => {
      const matchingUser = userLocal.find(
        (user) => user.AD_USER_ID === secondUser.user_id
      );
      return {
        ...secondUser,
        EMP_FNAME: matchingUser ? matchingUser.EMP_FNAME : null,
        EMP_LNAME: matchingUser ? matchingUser.EMP_LNAME : null,
        ORG_ID: matchingUser ? matchingUser.ORG_ID : null,
      };
    });
    console.log(secondDataWithDetails);
    setuserPermissionList(secondDataWithDetails);
  };
  useEffect(() => {
    
    fetchData();
  }, []);

  const handleUserSelect = async (selectedOption) => {
    if (selectedOption && selectedOption[0].user_id) {
      const res = await axios.post(`${pathurl}:7871/addPermission`, {
        fileid: clickedfile,
        type: "Viewer",
        userid: selectedOption[0].user_id,
      });
      console.log(res);
      // setSelectedUsers(selectedOption);
      fetchData();
    } else {
      return;
    }
  };

  const handleChangeRole = async (selectedOption, usrId) => {
    const res = await axios.put(`${pathurl}:7871/editpermission`, {
      fileid: clickedfile,
      type: selectedOption,
      user_id: usrId,
    });
    console.log(res.data);
    handleFetchUserPermission();
  };

  const handleRemoveRole = async (selectedOption, usrId) => {
    const res = await axios.put(`${pathurl}:7871/removepermission`, {
      fileid: clickedfile,
      // type: selectedOption,
      user_id: usrId,
    });
    console.log(res.data);
    handleFetchUserPermission();
  };

  const handleFetchUserPermission = async () => {
    try {
      console.log(clickedfile);
      const res = await axios.post(`${pathurl}:7871/getfilepermission`, {
        fileid: clickedfile,
      });
      console.log(res.data);
      setuserPermissionList(res.data)
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
  const handleChangeAccess = async (selectedOption) => {
    console.log(selectedOption);
  };

  return (
    <div className="max-h-[550px] min-h-[300px] w-[500px]">
      <div className="mb-4">
        {clickedfile}
        <Select
          components={animatedComponents}
          options={userList}
          value={selectedUsers}
          onChange={(e) => handleUserSelect(e)}
          placeholder="Add users"
          isSearchable
          isMulti
        />
      </div>
      <div className="">
        <p className="font-bold mb-2 ">Selected Users</p>
        <hr class="my-1 h-0.5 border-t-1 bg-neutral-100 opacity-100 dark:opacity-90" />
        <div className="overflow-y-auto min-h-[100px] max-h-[300px]">
          {userPermissionList &&
            userPermissionList.map((user) => (
              <div key={user.value} className="p-2 hover:bg-gray-100">
                <div className="flex place-content-between items-center">
                  <div className="flex">
                    <img
                      src={`https://api.nitisakc.dev/avatar/${user.user_id}`}
                      alt=""
                      className="w-[35px] h-[35px] rounded-full m-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://th.bing.com/th/id/OIP.DZ96fH-5g3OkZuMwb2Y5rgAAAA?rs=1&pid=ImgDetMain";
                      }}
                    />
                    <div className="ml-1">
                      <div className="text-sm">
                        {user.EMP_FNAME} {user.EMP_LNAME} ({user.ORG_ID})
                      </div>{" "}
                      <div className="text-sm text-gray-500">
                        {user.user_id}
                      </div>{" "}
                    </div>
                  </div>
                  <div className="">
                    <Menu
                      menuButton={
                        <MenuButton className="flex gap-2 hover:bg-gray-200 items-center rounded-lg px-0.5 ">
                          {user.fpm_type} <IoMdArrowDropdown />
                        </MenuButton>
                      }
                      transition
                    >
                      <MenuItem
                        value="Viewer"
                        onClick={(e) => handleChangeRole(e.value, user.user_id)}
                      >
                        Viewer
                      </MenuItem>
                      {/* <MenuItem
                        value="Editor"
                        onClick={(e) => handleChangeRole(e.value, user.user_id)}
                      >
                        Editor
                      </MenuItem> */}
                      <MenuItem
                        value="Remove"
                        onClick={(e) => handleRemoveRole(e.value, user.user_id)}
                      >
                        Remove
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
            ))}

          {selectedUsers &&
            selectedUsers.map((user) => (
              <div key={user.user_id} className="p-2 hover:bg-gray-100">
                <div className="flex place-content-between items-center">
                  <div className="flex">
                    <img
                      src={`https://api.nitisakc.dev/avatar/${user.user_id}`}
                      alt=""
                      className="w-[35px] h-[35px] rounded-full m-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://th.bing.com/th/id/OIP.DZ96fH-5g3OkZuMwb2Y5rgAAAA?rs=1&pid=ImgDetMain";
                      }}
                    />
                    <div className="ml-1">
                      <div className="text-sm">
                        {user.label} ({user.ORG_ID})
                      </div>{" "}
                      <div className="text-sm text-gray-500">
                        {user.user_id} 
                      </div>{" "}
                    </div>
                  </div>
                  <div className="">
                    <Menu
                      menuButton={
                        <MenuButton className="flex gap-2 hover:bg-gray-200 items-center rounded-lg px-0.5 ">
                          Viewer <IoMdArrowDropdown />
                        </MenuButton>
                      }
                      transition
                    >
                      <MenuItem
                        value="Viewer"
                        onClick={(e) => handleChangeRole(e.value, user.user_id)}
                      >
                        Viewer
                      </MenuItem>
                      {/* <MenuItem
                        value="Editor"
                        onClick={(e) => handleChangeRole(e.value, user.user_id)}
                      >
                        Editor
                      </MenuItem> */}
                      <MenuItem
                        value="Remove"
                        onClick={(e) => handleRemoveRole(e.value, user.user_id)}
                      >
                        Remove
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <hr class="my-1 h-0.5 border-t-1 bg-neutral-100 opacity-100 dark:opacity-90" />
      </div>
      <div className="mb-4">
        <div className="font-bold mb-4">General access</div>
        <div className="flex mt-2 ">
          <div className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
            <CiLock className="text-xl" />
          </div>
          <div className="ml-4">
            {" "}
            <div className="text-sm font-semibold">
              <Menu
                menuButton={
                  <MenuButton className="flex gap-2 hover:bg-gray-200 items-center rounded-lg px-0.5 ">
                    Restricted <IoMdArrowDropdown />
                  </MenuButton>
                }
                transition
              >
                <MenuItem
                  value="Restricted"
                  onClick={(e) => handleChangeAccess(e.value)}
                >
                  Restricted
                </MenuItem>
                <MenuItem
                  value="Public"
                  onClick={(e) => handleChangeAccess(e.value)}
                >
                  Public
                </MenuItem>
              </Menu>
            </div>
            <div className="text-sm">
              only people with access can see the content
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
