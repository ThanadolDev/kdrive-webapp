import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const StateContext = createContext();

const initalState = {};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [rightclickmodal, setrightclickmodal] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [editnamemodal, seteditnamemodal] = useState(false);
  const [deletemodal, setdeletemodal] = useState(false);
  const [addfoldermodal, setaddfoldermodal] = useState(false);
  const [folderhistory, setfolderhistory] = useState([]);
  const [editfoldernamemodal, seteditfoldernamemodal] = useState(false);
  const [rightClickFolderModal, setRightClickFolderModal] = useState(false);
  const [AddPlusModal, setAddPlusModal] = useState(false);
  const [deleteFolderModal, setdeleteFolderModal] = useState(false);
  const [permissionModal, setpermissionModal] = useState(false);
  const [currentParams, setcurrentParams] = useState();
  const [shareStatus, setshareStatus] = useState();
  const [permState, setpermState] = useState();
  const [clickedfile, setclickedfile] = useState();
  const openModal = (file) => {
    setSelectedFile(file);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
  };
  const openrightclickModal = () => {
    setrightclickmodal(true);
  };
  const closerightclickModal = () => {
    setrightclickmodal(false);
  };
  const openrightclickFolderModal = () => {
    setRightClickFolderModal(true);
  };
  const closerightclickFolderModal = () => {
    setRightClickFolderModal(false);
  };
  const openeditModal = () => {
    seteditnamemodal(true);
  };
  const closeeditmodal = () => {
    seteditnamemodal(false);
  };
  const opendeleteModal = () => {
    setdeletemodal(true);
  };
  const closedeletemodal = () => {
    setdeletemodal(false);
  };
  const openDeleteFolderModal = () => {
    setdeleteFolderModal(true);
  };
  const closeDeleteFolderModal = () => {
    setdeleteFolderModal(false);
  };
  const openaddfolder = () => {
    setaddfoldermodal(true);
  };
  const closeaddfolder = () => {
    setaddfoldermodal(false);
  };
  const openeditfolder = () => {
    seteditfoldernamemodal(true);
  };
  const closeeditfolder = () => {
    seteditfoldernamemodal(false);
  };
  const openAddPlusFolder = () => {
    setAddPlusModal(true);
  };
  const closeAddPlusFolder = () => {
    setAddPlusModal(false);
  };
  const openpermissionModal = () => {
    setpermissionModal(true);
  };
  const closepermissionModal = () => {
    setpermissionModal(false);
  };

  const addfolderhistory = (foldername, folderId) => {
    const newFolder = { foldername, folderId };
    setfolderhistory((prevHistory) => [...prevHistory, newFolder]);
    console.log(folderhistory);
  };

  const removeFolderAndSubsequent = (targetFolderId) => {
    const targetIndex = folderhistory.findIndex(folder => folder.folderId === targetFolderId);
    
    if (targetIndex !== -1) {
        const updatedHistory = folderhistory.slice(0, targetIndex + 1);
        console.log(updatedHistory);
        setfolderhistory(updatedHistory);
    } else {
        console.log('Target folder not found in history');
    }
};

  const removeAllFolderHistory = () => {
    setfolderhistory([]);
  };

  const setUrlParams = (url) => {
    setcurrentParams(url);
  };

  return (
    <StateContext.Provider
      value={{
        setUrlParams,
        currentParams,
        removeAllFolderHistory,
        openrightclickFolderModal,
        closerightclickFolderModal,
        rightClickFolderModal,
        openDeleteFolderModal,
        closeDeleteFolderModal,
        deleteFolderModal,
        openeditfolder,
        closeeditfolder,
        editfoldernamemodal,
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        setModalOpen,
        isModalOpen,
        openModal,
        closeModal,
        setSelectedFile,
        selectedFile,
        setUploadProgress,
        uploadProgress,
        setrightclickmodal,
        rightclickmodal,
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
        folderhistory,
        removeFolderAndSubsequent,
        openAddPlusFolder,
        closeAddPlusFolder,
        AddPlusModal,
        openpermissionModal,
        closepermissionModal,
        permissionModal,
        setshareStatus,
        shareStatus,
        setpermState,
        permState,
        setclickedfile,
        clickedfile
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateContext = () => useContext(StateContext);
