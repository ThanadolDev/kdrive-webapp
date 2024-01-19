import React, { useState, useEffect, useCallback } from "react";
import { Box } from "grommet";
import {
    Breadcrumb,
    Rightclickmodal,
    Checkfileicon,
    Displayfile,
} from "../components";
import { Modals } from "../components";
import { IoMdClose } from "react-icons/io";
import { CiFolderOn } from "react-icons/ci";
import { MdSaveAlt } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { IoFileTrayOutline } from "react-icons/io5";
const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

// const pathurl = `http://localhost`;
const pathurl = `http://192.168.55.37`;

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

    const onDrop = async (acceptedFiles) => {

        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            console.log(file)
            formData.append('upload', file);
        });

        try {
            const response = await axios.post(
                `${pathurl}:7870/upload`,
                formData
            );
            const FormDataDetail2 = {
                Folder: null,
                data: response.data[0],
                EMP_ID: localStorage.getItem("EMP_ID"),
            };
            console.log(response.data)
            await axios.post(`${pathurl}:7871/uploadfiles`, FormDataDetail2);
            fetchData()
        } catch (error) {
            console.error("Error uploading file: ", error);
            window.alert(error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
    });
    async function fetchData() {
        try {
            const urid = localStorage.getItem("EMP_ID");
            const fileResult = await axios.get(
                `${pathurl}:7871/getrootfiles/` + urid
            );
            const combinedData = {
                files: fileResult.data,
            };
            setFileList(fileResult.data);
            console.log("Files:", combinedData.files);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function downloadfile() {
        try {
            const downloadLink = document.createElement("a");
            downloadLink.href = `${pathurl}:7870/downloadfile/${clickedfile}`;

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

    // useEffect(() => {
    //   fetchData();
    // }, []);

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
            const res = await axios.delete(`${pathurl}:7871/deletefile/${fileId}`);
            console.log(res);
            closedeletemodal();
            fetchData();
        } catch (e) {
            console.log(e);
        }
    }

    async function editfilename(fileId) {
        if (!fileName.trim()) {
            console.log("File name cannot be empty");
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
            });
        } catch (e) {
            console.log(e);
        }
    }
    const containerClassName = `m-4 bg-white rounded-md overflow-auto h-[91vh] drop-shadow-sm ${isDragActive ? 'm-4 border-dashed bg-blue-100  border-4 border-gray-300' : ''
        }`;
    return (
        <>
            <div
                className={containerClassName}
                {...getRootProps()}
            >
                <div className="p-8">
                    <div className="mb-8">
                        <Breadcrumb />
                    </div>
                    {isDragActive ? <div className="absolute bg-blue-100 inset-0 flex items-center justify-center"><IoFileTrayOutline className="text-9xl " /> Drop file here</div> : ''}
                    <Box flex={true} wrap={true} direction="row" className="w-full gap-5">
                        {Filelist &&
                            Filelist.map((prev) => (
                                <div>
                                    <Box>
                                        <div
                                            onClick={() => {
                                                setclickedfile(prev.fileId);
                                                openModalFile(
                                                    prev.fileId,
                                                    prev.fileExtension,
                                                    prev.fileName
                                                );
                                            }}
                                            onContextMenu={(e) => {
                                                handleContextMenu(e);
                                                setclickedfile(prev.fileId);
                                            }}
                                            className=" bg-gray-100  max-h-[60px] w-52 items-center flex p-4 rounded-xl  cursor-pointer  hover:bg-gray-300"
                                            style={{ position: "relative" }}
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
                        <div>
                            <Box>
                                <div  onClick={() => {
                                                // setclickedfile(prev.fileId);
                                                // openModalFile(
                                                //     prev.fileId,
                                                //     prev.fileExtension,
                                                //     prev.fileName
                                                // );
                                            }}
                                            onContextMenu={(e) => {
                                                handleContextMenu(e);
                                                // setclickedfile(prev.fileId);
                                            }}
                                  className="bg-gray-100  max-h-[50px] w-52 items-center flex p-4 rounded-xl  cursor-pointer hover:bg-gray-300 ">
                                    <div className=" flex gap-2">
                                        <CiFolderOn className="text-xl" />
                                        <div>
                                            test folder
                                        </div>
                                    </div>
                                    <div className="ml-auto hover:bg-gray-400 p-0.5 rounded-xl">
                                        <IoMdMore className="text-xl" />
                                    </div>
                                </div>
                            </Box>
                        </div>
                    </Box>
                </div>
            </div>
            <Modals isOpen={isModalOpen} onClose={closeModal}>
                <div className="flex-row-reverse flex ">
                    <div
                        onClick={closeModal}
                        className="text-xl font-bold cursor-pointer mb-4 hover:bg-gray-400 rounded-xl p-2"
                    >
                        <IoMdClose className="text-xl" />
                    </div>
                    <div
                        onClick={() => downloadfile()}
                        className="text-xl font-bold mb-4 cursor-pointer hover:bg-gray-400 rounded-xl p-2 mr-2"
                    >
                        <FaDownload className="text-xl" />
                    </div>
                </div>
                {selectedFile && (
                    <div className="font-bold text-lg">{selectedFile.fileName}</div>
                )}
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
                <div
                    onClick={() => downloadfile()}
                    className="hover:bg-gray-400 p-2 rounded-md flex gap-4"
                >
                    <FaDownload className="text-xl" />
                    <div>Download file</div>
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
