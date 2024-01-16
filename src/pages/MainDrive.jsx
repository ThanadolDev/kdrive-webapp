import React, { useState, useEffect } from "react";
import { Box } from "grommet";
import { CiFolderOn } from "react-icons/ci";
import { FaFile } from "react-icons/fa";
import { Breadcrumb, Rightclickmodal } from "../components";
import { Modals } from "../components";
import { IoMdClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import { Document, Page } from "react-pdf";
import { json } from "react-router-dom";
const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

export const MainDrive = ({ fetchstate }) => {
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
  } = useStateContext();
  const [Filelist, setFileList] = useState();
  const [clickedfile, setclickedfile] = useState();
  const [fileName, setFileName] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  async function fetchData() {
    try {
      const fileResult = await axios.get("http://localhost:5000/getrootfiles");
      const combinedData = {
        files: fileResult.data,
      };
      setFileList(fileResult.data);
      console.log("Files:", combinedData.files);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    fetchData();
  }, [fetchstate]);

  const handleContextMenu = (event) => {
    event.preventDefault();
    const clickX = event.clientX;
    const clickY = event.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    openrightclickModal();
  };

  async function deletefile(fileId) {
    try {
      const res = await axios.delete(
        `http://localhost:5000/deletefile/${fileId}`
      );
      console.log(res);
      closedeletemodal();
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }

  async function editfilename(fileId) {
    try {
      const res = await axios.put(
        `http://localhost:5000/editfilename/${fileId}`,
        { input: fileName }
      );
      console.log(res);
      closeeditmodal();
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }

  async function openModalFile(fileId, fileExtension) {
    openModal();
    try {
      const response = await axios.get(
        `http://localhost:7870/displayfile/${fileId}`,
        { responseType: "arraybuffer" }
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      setSelectedFile({
        blob: URL.createObjectURL(blob),
        fileExtension: fileExtension,
      });
    } catch (e) {
      console.log(e);
    }
  }

  const displayFile = () => {
    switch (selectedFile.fileExtension) {
      case "image/webp":
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
        return <img src={selectedFile.blob} alt="Selected" />;
      case "application/pdf":
        return (
          <Document
            file={selectedFile.blob}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageIndex={index}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            ))}
          </Document>
        );
      default:
        return <p>Unsupported file type</p>;
    }
  };

  return (
    <>
      <div className="m-4 bg-white rounded-md h-[91vh] drop-shadow-sm">
        <div className="p-8 ">
          <div className="mb-8">
            <Breadcrumb />
          </div>
          {/* <Box
            flex={true}
            wrap={true}
            direction="row"
            className="w-full gap-5 mb-4"
          >
            <Box>
              <div className="text-xl bg-grey border-slate-200 border-2 w-60 items-center flex p-6 rounded-xl gap-5 cursor-pointer hover:drop-shadow-lg hover:bg-gray-200">
                <CiFolderOn />
                <div className="text-ellipsis">test</div>
              </div>
            </Box>
          </Box> */}

          <Box flex={true} wrap={true} direction="row" className="w-full gap-5">
            {Filelist &&
              Filelist.map((prev) => (
                <div>
                  <Box>
                    <div
                      onClick={() =>
                        openModalFile(prev.fileId, prev.fileExtension)
                      }
                      onContextMenu={(e) => {
                        handleContextMenu(e);
                        setclickedfile(prev.fileId);
                        console.log("test right click");
                      }}
                      className=" bg-grey border-slate-400 border-2 w-52 items-center flex p-4 rounded-xl gap-2 cursor-pointer hover:drop-shadow-lg hover:bg-gray-200"
                      style={{ position: "relative" }}
                    >
                      <FaFile className="" />
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
            {/* <Box>
              <div
                onClick={() => openModal()}
                className="text-xl bg-grey border-slate-400 border-2 w-52 items-center flex p-4 rounded-xl gap-5 cursor-pointer hover:drop-shadow-lg hover:bg-gray-200"
              >
                <FaFile />
                <div className="text-ellipsis">test.png</div>
              </div>
            </Box> */}
          </Box>
        </div>
      </div>
      <Modals isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex-row-reverse flex">
          <div
            onClick={closeModal}
            className="text-xl font-bold mb-4 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>
        {/* <img className="" src={selectedFile} /> */}

        {selectedFile && displayFile()}
      </Modals>

      <Rightclickmodal
        isOpen={rightclickmodal}
        onClose={closerightclickModal}
        position={contextMenuPosition}
        className="bg-white rounded shadow-lg"
      >
        <div
          onClick={openeditModal}
          className="hover:bg-gray-400 p-2 rounded-md flex gap-4"
        >
          <CiEdit className="text-xl" />
          <div>Edit Name</div>
        </div>
        <div
          onClick={opendeleteModal}
          className="hover:bg-gray-400 p-2 rounded-md flex gap-4"
        >
          <MdDeleteForever className="text-xl" />
          <div> Delete File</div>
        </div>
      </Rightclickmodal>
      <Modals isOpen={editnamemodal} onClose={closeeditmodal}>
        <div className="flex-row-reverse flex">
          <div
            onClick={closeeditmodal}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>
        <div className="font-bold  mb-2">Edit name</div>
        <div class="w-full mb-6 md:mb-0">
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded p-2 mb-3 focus:outline-none focus:bg-white"
            type="text"
            placeholder="Good files"
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <div className="flex-row-reverse flex">
          <div
            onClick={() => editfilename(clickedfile)}
            className=" flex items-center mb-2 hover:bg-blue-500 rounded-xl cursor-pointer hover:drop-shadow-lg gap-2 bg-blue-400 p-2"
          >
            <MdSaveAlt className="text-xl" />
            <div>Save</div>
          </div>
        </div>
      </Modals>
      <Modals isOpen={deletemodal} onClose={closedeletemodal}>
        <div className="flex-row-reverse flex">
          <div
            onClick={closedeletemodal}
            className="text-xl font-bold mb-2 hover:bg-gray-400 rounded-xl p-2"
          >
            <IoMdClose className="text-xl" />
          </div>
        </div>
        <div className="font-bold  mb-2">This will be permanently deleted</div>
        <div className="font-bold  mb-4">Continue?</div>
        <div className="flex-row-reverse flex gap-4">
          <div
            onClick={closedeletemodal}
            className=" flex items-center mb-2 hover:bg-blue-500 rounded-lg cursor-pointer hover:drop-shadow-lg gap-2 bg-blue-400 p-2"
          >
            <div>Cancel</div>
          </div>
          <div
            onClick={() => deletefile(clickedfile)}
            className=" flex items-center mb-2 hover:bg-gray-400 rounded-lg cursor-pointer hover:drop-shadow-lg gap-2 bg-gray-400 p-2"
          >
            <div>Confirm</div>
          </div>
        </div>
      </Modals>
    </>
  );
};
