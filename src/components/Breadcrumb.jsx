import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { MdExpandMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const Breadcrumb = ({ shareStatus }) => {
  const navigate = useNavigate();

  const {
    folderhistory,
    removeFolderAndSubsequent,
    removeAllFolderHistory,
    permState,
  } = useStateContext();

  return (
    <nav class="flex" aria-label="Breadcrumb">
      <div class="inline-flex items-center  space-x-1 md:space-x-2 rtl:space-x-reverse">
        <div class="inline-flex items-center">
          <div
            onClick={() => {
              {
                permState == "OWNER"
                  ? navigate(`/Drive`)
                  : navigate(`/ShareDrive`);
              }
              removeAllFolderHistory();
            }}
            // href="/Drive"
            style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            class="inline-flex items-center text-sm md:text-xl cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              class="w-3 h-3 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            {permState == "OWNER" ? "My Drive" : "Share Drive"}
          </div>
        </div>
        <div className=" max-w-[500px] md:w-[500px] flex inline-flex ">
          {folderhistory && folderhistory.length <= 3 ? (
            folderhistory.map((prev) => (
              <div>
                <div class="flex items-center ">
                  <svg
                    class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <div
                    // href={`/Drive/Folder/${prev.folderId}`}
                    onClick={() => {
                      navigate(`/Folder/${prev.folderId}`);
                      removeFolderAndSubsequent(prev.folderId);
                    }}
                    class="ms-1 text-sm overflow-hidden text-ellipsis md:text-xl md:max-w-[250px] max-w-[50px] cursor-pointer font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {prev.foldername}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center">
              <svg
                    class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
            <div className="relative inline-block group">
              
              <button className="inline-flex gap-1 items-center md:text-xl justify-center w-full rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                {folderhistory.length > 0 && folderhistory[folderhistory.length - 1].foldername}
                <MdExpandMore className="text-xl text-gray-500"/>
              </button>
          
              <div className="origin-top-right absolute left-0 w-56    rounded-md shadow-lg bg-white">
                <div
                  className="group-hover:block hidden"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {folderhistory.slice(0, -1).reverse().map((prev) => (
                    <div
                      key={prev.folderId}
                      onClick={() => {
                        navigate(`/Folder/${prev.folderId}`);
                        removeFolderAndSubsequent(prev.folderId);
                      }}
                      style={{  whiteSpace: 'nowrap' }}
                      className="block px-4 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis hover:bg-gray-100 hover:text-blue-900 cursor-pointer"
                      role="menuitem"
                    >
                      {prev.foldername}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          )}
        </div>
        {/* <li>
          <div class="flex items-center">
            <svg
              class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <a
              href="#"
              class="ms-1 text-xl font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
            >
              Projects
            </a>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg
              class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span class="ms-1 text-xl font-medium text-gray-500 md:ms-2 dark:text-gray-400">
              Flowbite
            </span>
          </div>
        </li> */}
      </div>
    </nav>
  );
};
