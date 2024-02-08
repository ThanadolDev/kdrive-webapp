import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegImages } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { useStateContext } from "../contexts/ContextProvider";
import { IoFolderOutline } from "react-icons/io5";
import { Modals, Displayfile, Checkfileicon } from "../components";
import { IoMdClose } from "react-icons/io";
import { LuHardDriveDownload } from "react-icons/lu";
import axios from "axios";
// const pathurl = `http://localhost`;
const pathurl = `http://192.168.55.37`;
export const NavSearchbar = ({setshowSearchBar}) => {
  const [activeSearch, setActiveSearch] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searching, setsearching] = useState(false);
  // const [SelectedFile,setSelectedFile] = useState()
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const Urlquery = searchParams.get("query");

  const {
    clickedfile,
    setclickedfile,
    selectedFile,
    setSelectedFile,
    isModalOpen,
    closeModal,
    openModal,
  } = useStateContext();
  let searchTimeout;

  const handleSearch = (e) => {
    console.log(e.target);
    console.log(searching);
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }
    clearTimeout(searchTimeout);
    setsearching(true);
    searchTimeout = setTimeout(() => {
      setSearchTerm(e.target.value);
      setsearching(false);
    }, 1000);
  };

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
      console.log(selectedFile);
    } catch (e) {
      console.log(e);
    }
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
  const fetchData = async () => {
    const Pdffilter = searchParams.get("pdf");
    const imagefilter = searchParams.get("image");
    try {
      const response = await fetch(`${pathurl}:7871/Searchbar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usrid: localStorage.getItem("EMP_ID"),
          Term: searchTerm,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setActiveSearch(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (searchTerm !== "") {
      fetchData();
    }
  }, [searchTerm]);

  return (
    <>
      <div
        onFocus={() => setIsSearchClicked(true)}
        onBlur={() => setIsSearchClicked(false)}
        className=" w-[100%]  md:relative "
      >
        <div className="relative ">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <AiOutlineSearch />
          </div>
          <input
            type="search"
            placeholder="Type Here"
            className="pl-8 w-full border-1 p-2 rounded-full"
            onChange={(e) => handleSearch(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(e);
                navigate(`/Search?query=${encodeURIComponent(searchTerm)}`);
              }
            }}
          />
        </div>
        {isSearchClicked && (
          <div className="absolute bg-white p-4 w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2 drop-shadow-sm">
            {searching && (
              <div>
                <span className="flex items-center gap-4 hover:bg-gray-200 p-4">
                  loading ...
                </span>
              </div>
            )}
            {activeSearch?.folders?.length > 0 && (
              <>
                {activeSearch.folders.map((s) => (
                  <div
                    key={s.folderId}
                    className="flex items-center gap-4 hover:bg-gray-200 p-4"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      navigate(`/Folder/${s.folderId}`);
                      setIsSearchClicked(false);
                    }}
                  >
                    {/* <AiOutlineSearch /> */}
                    <IoFolderOutline />
                    <div>{s.folderName}</div>
                  </div>
                ))}
              </>
            )}
            {activeSearch?.files?.length > 0 && (
              <>
                {activeSearch.files.map((s) => (
                  <span
                    key={s.fileId}
                    className="flex items-center gap-4 hover:bg-gray-200 p-4"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setclickedfile({
                        fileId: s.fileId,
                        type: "File",
                        Name: s.fileName,
                      });
                      openModalFile(s.fileId, s.fileExtension, s.fileName);
                      setIsSearchClicked(false);
                    }}
                  >
                    <Checkfileicon fileExtension={s.fileExtension} />
                    <div>{s.fileName}</div>
                  </span>
                ))}
              </>
            )}
            {activeSearch?.folders?.length === 0 ||
              (activeSearch?.folders?.length === 0 && <div>Not found</div>)}

            {/* <div className="flex justify-between gap-4 p-4">
            <div>
              <input
                type="checkbox"
                id="pdf-option"
                value=""
                class="hidden peer"
                required=""
              />
              <label
                for="pdf-option"
                class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="block text-xl text-red-600 items-center justify-center">
                  <FaRegFilePdf />
                </div>
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="image-option"
                value=""
                class="hidden peer"
                required=""
              />
              <label
                for="image-option"
                class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="block text-xl text-blue-600 items-center justify-center">
                  <FaRegImages />
                </div>
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="video-option"
                value=""
                class="hidden peer"
                required=""
              />
              <label
                for="video-option"
                class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="block text-xl text-sky-600 items-center justify-center">
                  <FaVideo />
                </div>
              </label>
            </div>
          </div> */}
          </div>
        )}
      </div>
      <div 
      onClick={() => {
        setIsSearchClicked(false)
        setshowSearchBar(false)
      }} 
      className=" relative ml-4 mr-4 hover:bg-gray-100 p-2 rounded-full">
        <AiOutlineClose className="text-xl cursor-pointer" />
      </div>
    </>
  );
};
