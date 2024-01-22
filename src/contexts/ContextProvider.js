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
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0,y: 0,});
  const [editnamemodal, seteditnamemodal] = useState(false)
  const [deletemodal, setdeletemodal] = useState(false)
  const [addfoldermodal, setaddfoldermodal] = useState(false)
  const [folderhistory, setfolderhistory] = useState([])

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
  const openeditModal = () => {
    seteditnamemodal(true)
  }
  const closeeditmodal = () => {
    seteditnamemodal(false)
  }
  const opendeleteModal = () => {
    setdeletemodal(true)
  }
  const closedeletemodal = () => {
    setdeletemodal(false)
  }
  const openaddfolder = () => {
   setaddfoldermodal(true)
  }
  const closeaddfolder = () => {
    setaddfoldermodal(false)
  }

  const addfolderhistory = (foldername,folderId) => {
    const newFolder = { foldername, folderId };
    setfolderhistory((prevHistory) => [...prevHistory, newFolder]);
    console.log(folderhistory)
  }
  
const removeFolderAndSubsequent = (clickedFolderId) => {
  setfolderhistory((prevHistory) => {
    const indexToRemove = prevHistory.findIndex(
      (folder) => folder.folderId === clickedFolderId
    );

    if (indexToRemove !== -1) {
      return prevHistory.slice(0, indexToRemove);
    }

    return prevHistory;
  });
};


  return (
    <StateContext.Provider
      value={{
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
        removeFolderAndSubsequent
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateContext = () => useContext(StateContext);
