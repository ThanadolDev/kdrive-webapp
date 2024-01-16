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
        closedeletemodal
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateContext = () => useContext(StateContext);
