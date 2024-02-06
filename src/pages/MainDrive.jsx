import React, { useState, useEffect, useCallback } from "react";
import { Box } from "grommet";
import { useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  Rightclickmodal,
  Checkfileicon,
  Displayfile,
} from "../components";
import { MdNoteAdd } from "react-icons/md";
import { Dummyfolder } from "../data/dummy";
import { Modals, UserList } from "../components";
import { IoMdClose } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { CiFolderOn } from "react-icons/ci";
import { IoLinkOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import { LuHardDriveDownload } from "react-icons/lu";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { IoFileTrayOutline } from "react-icons/io5";
import "react-select-search/style.css";

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

// const pathurl = `http://localhost`;
const pathurl = `http://192.168.55.37`;

export const MainDrive = ({
  fetchstate,
  folderId,
  fetchheader,
  shareStatus,
  Urlquery
}) => {
  const {
    activeMenu,
    isModalOpen,
    openModal,
    closeModal,
    selectedFile,
    uploadProgress,
    setSelectedFile,
    rightclickmodal,
    setrightclickmodal,
    openrightclickModal,
    closerightclickModal,
    setContextMenuPosition,
    contextMenuPosition,
    editnamemodal,
    deletemodal,
    openeditModal,
    closeeditmodal,
    opendeleteModal,
    closedeletemodal,
    openaddfolder,
    closeaddfolder,
    addfoldermodal,
    addfolderhistory,
    openeditfolder,
    closeeditfolder,
    editfoldernamemodal,
    openrightclickFolderModal,
    closerightclickFolderModal,
    rightClickFolderModal,
    openDeleteFolderModal,
    closeDeleteFolderModal,
    deleteFolderModal,
    folderhistory,
    openAddPlusFolder,
    closeAddPlusFolder,
    AddPlusModal,
    currentParams,
    setUploadProgress,
    openpermissionModal,
    closepermissionModal,
    permissionModal,
    permState,
    setpermState,
  } = useStateContext();

  const [Filelist, setFileList] = useState();
  const [Folderlist, setFolderList] = useState();
  const [clickedfile, setclickedfile] = useState();
  const [fileName, setFileName] = useState("");
  const [folderName, setfolderName] = useState("");
  const [folderState, setfolderState] = useState(false);
  const [fetchStatus, setfetchStatus] = useState(false);
  const [fetchError, setfetchError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const onDrop = async (acceptedFiles) => {

    if (permState != "Owner" && permState != "Editor") {
      console.error("You don't have permission to do that");
      window.alert("You don't have permission to upload file in this folder");
      return;
    }
    if (acceptedFiles.length > 1) {
      console.error("Error: Only one file can be uploaded at a time.");
      window.alert("Error: Only one file can be uploaded at a time.");
      return;
    }

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      console.log(file);
      formData.append("upload", file);
    });

    try {
      const response = await axios.post(`${pathurl}:7870/upload`, formData);
      const FormDataDetail2 = {
        Folder: folderState ? folderId : null,
        data: response.data[0],
        EMP_ID: localStorage.getItem("EMP_ID"),
      };
      console.log(response.data);
      await axios.post(`${pathurl}:7871/uploadfiles`, FormDataDetail2);
      fetchData();
    } catch (error) {
      console.error("Error uploading file: ", error);
      window.alert(error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    console.log(currentParams);
    formData.append("upload", file);
    try {
      const response = await axios.post(`${pathurl}:7870/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(percentCompleted);
          setUploadProgress(percentCompleted);
        },
      });
      setUploadProgress(0);
      const FormDataDetail2 = {
        Folder: folderState ? folderId : null,
        data: response.data[0],
        EMP_ID: localStorage.getItem("EMP_ID"),
      };
      await axios.post(`${pathurl}:7871/uploadfiles`, FormDataDetail2);
      fetchData();
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file: ", error);
      window.alert(error);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  async function fetchShareData() {
    if (!shareStatus) {
      console.log("fetchingshare");
      return;
    }
    setfetchStatus(true);
    try {
      const urid = localStorage.getItem("EMP_ID");
      const fileResult = await axios.get(
        `${pathurl}:7871/getsharedfiles/` + urid
      );
      const folderResult = await axios.get(
        `${pathurl}:7871/getsharefolders/` + urid
      );
      const combinedData = {
        files: fileResult.data,
        folders: folderResult.data,
      };
      setFileList(fileResult.data);
      setFolderList(folderResult.data);
      setpermState("Viewer");
      console.log("Files:", combinedData.folders);
    } catch (error) {
      setfetchError(true);
      console.error("Error fetching data:", error);
    }
    setfetchStatus(false);
  }

  async function fetchData() {
    if (shareStatus) {
      console.log("fetchownroot");
      return;
    }
    setfetchStatus(true);
    try {
      const urid = localStorage.getItem("EMP_ID");

      if (folderId !== undefined) {
        const fileResult = await axios.get(
          `${pathurl}:7871/getfileinfolder/${folderId}/${urid}`
        );
        const combinedData = {
          files: fileResult.data,
        };
        if (fileResult && fileResult.data) {
          setFileList(fileResult.data.files);
          setFolderList(fileResult.data.folders);
          setpermState(fileResult.data.perm);
        }

        console.log("Files:", fileResult.data.perm);
      } else {
        const fileResult = await axios.get(
          `${pathurl}:7871/getrootfiles/` + urid
        );
        const folderResult = await axios.get(
          `${pathurl}:7871/getrootfolder/` + urid
        );
        const combinedData = {
          files: fileResult.data.mappedResult,
          folder: folderResult.data.mappedFolderResult,
          prem: folderResult.data.prem,
        };
        setFileList(fileResult.data.mappedResult);
        setFolderList(folderResult.data.mappedFolderResult);
        setpermState(fileResult.data.prem);
        console.log("Files:", combinedData);
      }
    } catch (error) {
      setfetchError(true);
      console.error("Error fetching data:", error);
    }
    setfetchStatus(false);
  }

  async function downloadfile() {
    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = `${pathurl}:7870/downloadfile/${clickedfile.fileId}`;

      const newWindow = window.open("", "_blank");
      newWindow.document.write(
        "<html><head><title>Opening Link</title></head><body>Downloading"
      );

      newWindow.location.href = downloadLink.href;

      setTimeout(() => {
        newWindow.close();
      }, 500);

      newWindow.document.write("</body></html>");
      newWindow.document.close();
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchSearchData(){
    setfetchStatus(true);
    try{
      const Pdffilter = searchParams.get('pdf');
      const imagefilter = searchParams.get('image')
      const data = {
        EMP_ID: localStorage.getItem("EMP_ID"),
        Term: Urlquery,
        Filter: {
          Pdf: Pdffilter,
          Image: imagefilter,
        }
      };
      const respage = await axios(`${pathurl}:7871/Searchpage`,data)
      console.log(respage.data)
      setFileList(respage.data.folders);
      setFolderList(respage.data.files);
    }catch(e){
      console.log(e)
      // window.alert(e)
    }
    setfetchStatus(false);
  }


  useEffect(() => {
    if(Urlquery !== null){
      fetchSearchData()
    }else{
    fetchData();
    fetchShareData();
    }
    if (folderId !== undefined) {
      setfolderState(true);
    }
    
    console.log("fetching"+Urlquery);
  }, [fetchstate, folderId]);

  const handleContextMenu = (event) => {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    openrightclickModal();
  };

  const handleFolderContextMenu = (event) => {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    openrightclickFolderModal();
  };

  const handleAddPlusContextMenu = (event) => {
    event.preventDefault();
    console.log(event);
    const clickX = event.clientX;
    const clickY = event.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    openAddPlusFolder();
  };

  async function deletefile(fileId) {
    try {
      const res = await axios.delete(`${pathurl}:7871/deletefile/${fileId}`);
      console.log(res);
      closedeletemodal();
      fetchData();
    } catch (e) {
      console.log(e);
      window.alert(e);
    }
  }

  async function deletefolder(folderId) {
    try {
      const res = await axios.delete(
        `${pathurl}:7871/deletefolder/${folderId}`
      );
      console.log(res);
      closeDeleteFolderModal();
      fetchData();
    } catch (e) {
      console.log(e);
      window.alert(e);
    }
  }

  async function addfolder() {
    if (!folderName.trim()) {
      console.log("Folder name cannot be empty");
      window.alert("Folder name can't be empty");
      return;
    }
    try {
      const data = {
        folderName: folderName,
        EMP_ID: localStorage.getItem("EMP_ID"),
        ParentFolder: folderState ? folderId : null,
      };

      const res = await axios.post(`${pathurl}:7871/addfolder`, data);
      console.log(res);
      closeaddfolder();
      fetchData();
    } catch (e) {
      console.log(e);
      window.alert(e);
    }
  }

  async function editfoldername() {
    if (!folderName.trim()) {
      console.log("Folder name cannot be empty");
      window.alert("Folder name can't be empty");
      return;
    }
    try {
      const data = {
        folderName: folderName,
        EMP_ID: localStorage.getItem("EMP_ID"),
        Folder_id: clickedfile.fileId,
      };

      const res = await axios.put(`${pathurl}:7871/editfoldername`, data);
      console.log(res);
      closeeditfolder();
      fetchData();
    } catch (e) {
      console.log(e);
      window.alert(e);
    }
  }

  async function editfilename(fileId) {
    if (!fileName.trim()) {
      console.log("File name cannot be empty");
      window.alert("File name can't be empty");
      return;
    }

    try {
      const res = await axios.put(`${pathurl}:7871/editfilename/${fileId}`, {
        input: fileName,
      });
      console.log(res);
      closeeditmodal();
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }

  async function openModalFile(fileId, fileExtension, fileName) {
    openModal();
    try {
      const response = await axios.get(
        `${pathurl}:7870/displayfile/${fileId}`,
        { responseType: "arraybuffer" }
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      setSelectedFile({
        blob: URL.createObjectURL(blob),
        fileExtension: fileExtension,
        fileName: fileName,
        fileId: fileId,
      });
    } catch (e) {
      console.log(e);
    }
  }
  const containerClassName = `m-4 bg-white rounded-md overflow-auto h-[85vh] md:static  ${
    isDragActive
      ? "m-4 border-dashed bg-blue-100 z-10  border-4 border-gray-300"
      : ""
  }`;

  return (
    <>
      <div className={containerClassName} {...getRootProps()}>
        <div className="px-8 py-4">
          <div className="flex mb-8 ">
            <div
              class={`${
                permState != "Owner" && permState != "Editor" ? "" : "dropdown"
              }  inline-block justify-center `}
            >
              <button
                class={`${
                  permState != "Owner" && permState != "Editor"
                    ? "text-gray-300 cursor-not-allowed bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }   w-32 place-content-between   text-gray-700 text-white py-2 px-2 rounded inline-flex items-center`}
              >
                <div className="flex items-center gap-2 ">
                  <IoAddOutline className="text-xl " />
                  <div>New</div>
                </div>
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                </svg>
              </button>
              <ul class="dropdown-menu absolute hidden border-1 text-gray-700 rounded-xl shadow-lg">
                <li class="cursor-pointer">
                  <div
                    class="rounded-t bg-white hover:bg-gray-300 flex items-center gap-2 py-2 px-4 block whitespace-no-wrap"
                    onClick={openaddfolder}
                  >
                    <MdOutlineCreateNewFolder className="text-xl" />
                    Add folder
                  </div>
                </li>
                <li className="cursor-pointer">
                  <button class="rounded-b bg-white hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MdOutlineFileUpload className="text-xl" />
                        <div>Upload file</div>
                      </div>
                      <input
                        type="file"
                        id="doc"
                        name="doc"
                        onChange={handleFileChange}
                        hidden
                      />
                    </label>
                  </button>
                </li>
              </ul>
            </div>

            {/* <button class="bg-blue flex hover:bg-blue-light gap-2 items-center py-1 px-3 border-2 rounded-lg ml-2">
              <label className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <MdOutlineFileUpload className="text-xl text-gray-900" />
                  <div>Upload file</div>
                </div>
                <input
                  type="file"
                  id="doc"
                  name="doc"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            </button> */}
          </div>
          <div className="mb-8 flex items-center">
            <Breadcrumb shareStatus={shareStatus} />
          </div>
          {isDragActive ? (
            <div className="absolute bg-blue-100 inset-0 flex items-center justify-center">
              <IoFileTrayOutline className="text-9xl " /> Drop file here
            </div>
          ) : (
            ""
          )}

          {fetchStatus && (
            <div className="w-full">
              <div role="status" class="max-w-[300px] animate-pulse">
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
                <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {Folderlist && Folderlist.length >= 1 && (
            <div className="mb-2 font-bold">Folder</div>
          )}
          <Box flex={true} wrap={true} direction="row" className="w-full gap-5">
            {!fetchStatus &&
              Folderlist &&
              Folderlist.map((prev) => (
                <div>
                  <Box>
                    <div
                      onClick={() => {
                        addfolderhistory(prev.folderName, prev.folderId);
                        navigate(`/Folder/${prev.folderId}`);
                      }}
                      onContextMenu={(e) => {
                        handleFolderContextMenu(e);
                        setclickedfile({ fileId: prev.folderId, type: "Folder" });
                      }}
                      className="bg-gray-100  max-h-[50px] min-w-56  max-w-56 items-center flex p-4 rounded-xl  cursor-pointer hover:bg-gray-300 "
                    >
                      <div className=" flex gap-2">
                        <CiFolderOn className="text-xl" />
                        <div>{prev.folderName}</div>
                      </div>
                    </div>
                    {/* <div
                      onClick={(e) => {
                        handleFolderContextMenu(e);
                        setclickedfile(prev.folderId);
                      }}
                      className="ml-auto hover:bg-gray-400 p-0.5 ml-3 mt-3 rounded-xl absolute"
                    >
                      <IoMdMore className="text-xl" />
                    </div> */}
                  </Box>
                </div>
              ))}
          </Box>
          {Filelist && Filelist.length >= 1 && (
            <div className="my-2 font-bold">Files</div>
          )}

          <Box flex={true} wrap={true} direction="row" className="w-full gap-5">
            {!fetchStatus &&
              Filelist &&
              Filelist.map((prev) => (
                <div>
                  <Box>
                    <div
                      onClick={() => {
                        setclickedfile({fileId: prev.fileId, type: "File"});
                        openModalFile(
                          prev.fileId,
                          prev.fileExtension,
                          prev.fileName
                        );
                      }}
                      onContextMenu={(e) => {
                        handleContextMenu(e);
                        setclickedfile({fileId: prev.fileId, type: "File"});
                      }}
                      className=" bg-gray-100  max-h-[60px] min-w-56 max-w-56 items-center flex p-4 rounded-xl  cursor-pointer  hover:bg-gray-300"
                      //   style={{ position: "relative" }}
                    >
                      {/* <FaFile className="mr-2" /> */}
                      <div className="mr-2 text-xl">
                        <Checkfileicon fileExtension={prev.fileExtension} />
                      </div>
                      <div
                        className="overflow-hidden text-ellipsis"
                        style={{ textOverflow: "ellipsis" }}
                      >
                        {prev.fileName}
                      </div>
                    </div>
                  </Box>
                </div>
              ))}
          </Box>
          {Folderlist &&
            Folderlist.length === 0 &&
            Filelist &&
            Filelist.length === 0 && (
              <div className="flex items-center w-full justify-center h-[70vh]">
                <div className="text-gray-500   inset-0 flex items-center justify-center">
                  <MdNoteAdd className="text-9xl " /> This folder is empty
                </div>
              </div>
            )}
          {fetchError && <div>Fetching error. Try again later</div>}
        </div>
      </div>
      <Modals isOpen={isModalOpen} onClose={closeModal}>
        <div className="place-content-between flex items-center">
          {selectedFile && (
            <div className="font-bold text-lg">{selectedFile.fileName}</div>
          )}
          <div className="flex ">
            <div
              onClick={() => downloadfile()}
              className="text-xl font-bold mb-4 cursor-pointer hover:bg-gray-400 rounded-xl p-2 mr-2"
            >
              <LuHardDriveDownload className="" />
            </div>
            <div
              onClick={closeModal}
              className="text-xl font-bold cursor-pointer mb-4 hover:bg-gray-400 rounded-xl p-2"
            >
              <IoMdClose className="text-xl" />
            </div>
          </div>
        </div>

        <div>
          {selectedFile ? (
            <Displayfile selectedFile={selectedFile} />
          ) : (
            <div role="status" class="max-w-sm animate-pulse">
              <div class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                <svg
                  class="w-10 h-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Modals>

      <Rightclickmodal
        isOpen={rightclickmodal}
        onClose={closerightclickModal}
        position={contextMenuPosition}
        className="bg-white rounded shadow-lg"
      >
        <div
          onClick={() => downloadfile()}
          className="hover:bg-gray-400 p-2 rounded-md flex gap-4 items-center"
        >
          <LuHardDriveDownload className="text-lg" />
          <div>Download File</div>
        </div>
        <div
          onClick={() => {
            if (permState == "Owner" || permState == "Editor") {
              openeditModal();
            }
          }}
          className={`${
            permState == "Owner"
                ? "hover:bg-gray-400"
                : permState == "Editor"
                ? "hover:bg-blue-400"
                : "text-gray-300 cursor-not-allowed"
        } p-2 rounded-md flex gap-4 items-center`}
        >
          <CiEdit className="text-xl" />
          <div>Edit File Name</div>
        </div>
        <div
          onClick={() => {
            if (permState == "Owner" || permState == "Editor") {
              openpermissionModal();
            }
          }}
          className={`${
            permState == "Owner"
                ? "hover:bg-gray-400"
                : permState == "Editor"
                ? "hover:bg-blue-400"
                : "text-gray-300 cursor-not-allowed"
        } p-2 rounded-md flex gap-4 items-center`}
        >
          <CiShare2 className="text-xl" />
          <div>Sharing</div>
        </div>
        <hr
          class={`my-1 h-0.5 border-t-1 bg-neutral-100 opacity-100 dark:opacity-90`}
        />
        <div
          onClick={() => {
            if (permState == "Owner" || permState == "Editor") {
              opendeleteModal();
            }
          }}
          className={`${
            permState == "Owner"
                ? "hover:bg-gray-400"
                : permState == "Editor"
                ? "hover:bg-blue-400"
                : "text-gray-300 cursor-not-allowed"
        } p-2 rounded-md flex gap-4 items-center`}
        >
          <MdDeleteForever className="text-xl text-red-600" />
          <div className="text-red-600"> Delete File</div>
        </div>
      </Rightclickmodal>

      <Rightclickmodal
        isOpen={rightClickFolderModal}
        onClose={closerightclickFolderModal}
        position={contextMenuPosition}
        className="bg-white rounded shadow-lg"
      >
        <div
          onClick={() => {
            if (permState == "Owner" || permState == "Editor") {
              openeditfolder();
            }
          }}
          className={`${
            permState == "Owner"
                ? "hover:bg-gray-400"
                : permState == "Editor"
                ? "hover:bg-blue-400"
                : "text-gray-300 cursor-not-allowed"
        } p-2 rounded-md flex gap-4 items-center`}
        >
          <CiEdit className="text-xl" />
          <div className="">Edit Folder Name</div>
        </div>
        <div
          onClick={() => {
            if (permState == "Owner"  || permState == "Editor") {
              openpermissionModal();
            }
          }}
          className={`${
            permState == "Owner"
                ? "hover:bg-gray-400"
                : permState == "Editor"
                ? "hover:bg-blue-400"
                : "text-gray-300 cursor-not-allowed"
        } p-2 rounded-md flex gap-4 items-center`}
        >
          <CiShare2 className="text-xl " />
          <div>Sharing</div>
        </div>
        <hr class="my-1 h-0.5 border-t-1 bg-neutral-100 opacity-100 dark:opacity-90" />
        <div
          onClick={() => {
            if (permState == "Owner" || permState == "Editor") {
              openDeleteFolderModal();
            }
          }}
          className={`${
            permState == "Owner"
                ? "hover:bg-gray-400"
                : permState == "Editor"
                ? "hover:bg-blue-400"
                : "text-gray-300 cursor-not-allowed"
        } p-2 rounded-md flex gap-4 items-center`}
        >
          <MdDeleteForever className="text-xl text-red-600" />
          <div className="text-red-600">Delete Folder</div>
        </div>
      </Rightclickmodal>

      <Rightclickmodal
        isOpen={AddPlusModal}
        onClose={closeAddPlusFolder}
        position={contextMenuPosition}
        className="bg-white rounded shadow-lg"
      >
        <div
          onClick={openaddfolder}
          className="hover:bg-gray-400 p-2 rounded-md flex gap-4 items-center cursor-pointer"
        >
          <IoAddOutline className="text-xl text-blue-700" />
          <div>Add Folder</div>
        </div>
      </Rightclickmodal>

      <Modals isOpen={editnamemodal} onClose={closeeditmodal}>
        <div className="place-content-between items-center flex mb-2">
          <div className="font-bold  mb-2">Edit name</div>
          <div
            onClick={closeeditmodal}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>

        <div class="w-full mb-6 md:mb-0">
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded p-2 mb-3 focus:outline-none focus:bg-white"
            type="text"
            placeholder="Good files"
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <div className="flex-row-reverse flex gap-4 mt-2">
          <div
            onClick={closeeditmodal}
            className=" flex items-center mb-2 hover:bg-gray-100 rounded-lg cursor-pointer mt-2   border-1 px-2 py-1"
          >
            <div>Cancel</div>
          </div>
          <div
            onClick={() => editfilename(clickedfile.fileId)}
            className=" flex items-center mb-2 hover:bg-blue-700 rounded-lg cursor-pointer mt-2 gap-2 bg-blue-600 text-white px-2 py-1"
          >
            <div>Rename</div>
          </div>
        </div>
      </Modals>

      <Modals isOpen={deletemodal} onClose={closedeletemodal}>
        <div className="place-content-between items-center flex mb-2">
          <div className="font-bold">Delete?</div>
          <div
            onClick={closedeletemodal}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>
        <div className=" mb-2">This will be permanently deleted</div>
        <div className=" mb-4">Continue?</div>
        <div className="flex-row-reverse flex gap-4 mt-2">
          <div
            onClick={closedeletemodal}
            className=" flex items-center mb-2 hover:bg-gray-100 rounded-lg cursor-pointer  gap-2 border-1 px-2 py-1"
          >
            <div>Cancel</div>
          </div>
          <div
            onClick={() => deletefile(clickedfile.fileId)}
            className=" flex items-center mb-2 hover:bg-blue-700 rounded-lg cursor-pointer  gap-2 bg-blue-600 text-white px-2 py-1"
          >
            <div>Delete</div>
          </div>
        </div>
      </Modals>

      <Modals isOpen={deleteFolderModal} onClose={closeDeleteFolderModal}>
        <div className="place-content-between items-center flex mb-2">
          <div className="font-bold">Delete?</div>
          <div
            onClick={closeDeleteFolderModal}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>
        <div className=" mb-2">This will be permanently deleted</div>
        <div className="  mb-4">Continue?</div>
        <div className="flex-row-reverse flex gap-4 mt-2">
          <div
            onClick={closeDeleteFolderModal}
            className=" flex items-center mb-2 hover:bg-gray-100 rounded-lg cursor-pointer  gap-2 border-1 px-2 py-1"
          >
            <div>Cancel</div>
          </div>
          <div
            onClick={() => deletefolder(clickedfile.fileId)}
            className=" flex items-center mb-2 hover:bg-blue-700 rounded-lg cursor-pointer  gap-2 bg-blue-600 text-white px-2 py-1"
          >
            <div>Delete</div>
          </div>
        </div>
      </Modals>

      <Modals isOpen={addfoldermodal} onClose={closeaddfolder}>
        <div className="place-content-between items-center flex mb-2">
          <div className="mb-2 font-bold">Folder Name</div>
          <div
            onClick={closeaddfolder}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>

        <div class="w-full mb-6 md:mb-0">
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded p-2 mb-3 focus:outline-none focus:bg-white"
            type="text"
            placeholder="Good folder"
            onChange={(e) => setfolderName(e.target.value)}
          />
        </div>
        <div className="flex-row-reverse flex gap-4 mt-2">
          <div
            onClick={closeaddfolder}
            className=" flex items-center mb-2 hover:bg-gray-100 rounded-lg cursor-pointer  gap-2 border-1 px-2 py-1"
          >
            <div>Cancel</div>
          </div>
          <div
            onClick={() => addfolder()}
            className=" flex items-center mb-2 hover:bg-blue-700 rounded-lg cursor-pointer  gap-2 bg-blue-600 text-white px-2 py-1"
          >
            <div>Create folder</div>
          </div>
        </div>
      </Modals>
      <Modals isOpen={editfoldernamemodal} onClose={closeeditfolder}>
        <div className="place-content-between items-center flex mb-2">
          <div className="mb-2 font-bold">Edit Folder Name</div>
          <div
            onClick={closeeditfolder}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>

        <div class="w-full mb-6 md:mb-0">
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded p-2 mb-3 focus:outline-none focus:bg-white"
            type="text"
            placeholder="Good folder"
            onChange={(e) => setfolderName(e.target.value)}
          />
        </div>
        <div className="flex-row-reverse flex gap-4 mt-2">
          <div
            onClick={closeeditfolder}
            className=" flex items-center mb-2 hover:bg-gray-100 rounded-lg cursor-pointer  gap-2 border-1 px-2 py-1"
          >
            <div>Cancel</div>
          </div>
          <div
            onClick={() => editfoldername()}
            className=" flex items-center mb-2 hover:bg-blue-700 rounded-lg cursor-pointer  gap-2 bg-blue-600 text-white px-2 py-1"
          >
            <div>Rename</div>
          </div>
        </div>
      </Modals>

      <Modals isOpen={permissionModal} onClose={closepermissionModal}>
        <div className="place-content-between items-center flex mb-2">
          <div className="mb-2 font-bold">Share</div>
          <div
            onClick={closepermissionModal}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>

        <div class="w-full items-center  mb-6 md:mb-0"></div>
        <div>
          <div>
            <UserList clickedfile={clickedfile} />
          </div>
        </div>

        <div className="place-content-between flex gap-4 mt-2 items-center">
          <div
            onClick={closepermissionModal}
            className=" flex items-center text-blue-600 mb-2 hover:bg-gray-200 rounded-full cursor-pointer  gap-2 bg-white border-1 px-2 py-2"
          >
            <div>
              <IoLinkOutline />
            </div>
            <div>Copy Link</div>
          </div>
          <div
            onClick={closepermissionModal}
            className=" flex items-center mb-2 hover:bg-blue-700 rounded-lg cursor-pointer  gap-2 bg-blue-600 text-white px-2 py-1"
          >
            <div>Done</div>
          </div>
        </div>
      </Modals>
    </>
  );
};
