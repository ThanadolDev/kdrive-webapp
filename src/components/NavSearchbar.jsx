import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegImages } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
// const pathurl = `http://localhost`;
const pathurl = `http://192.168.55.37`;
export const NavSearchbar = () => {
  const [activeSearch, setActiveSearch] = useState([]);
  const timerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const Urlquery = searchParams.get('query');

  const handleSearch = (e) => {
    console.log(e.target)
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }
    setSearchTerm(e.target.value);
  };
  const fetchData = async () => {
    const Pdffilter = searchParams.get('pdf');
    const imagefilter = searchParams.get('image')
    try {
      const response = await fetch(`${pathurl}:7871/Searchbar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usrid: localStorage.getItem("EMP_ID"),
          Term: searchTerm
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setActiveSearch(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (searchTerm !== "") {
      fetchData();
    }

  }, [searchTerm]);


  return (
    <div className="w-[400px]  relative">
      <div className="relative">
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

      {activeSearch.length > 0 && (
        <div className="absolute bg-white p-4 w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
          {activeSearch.map((s) => (
            <span className="flex items-center gap-4 hover:bg-gray-200 p-4"> <AiOutlineSearch /><div>{s}</div></span>
          ))}
          <div className="flex gap-4 p-4">
          <div>
            <input type="checkbox" id="pdf-option" value="" class="hidden peer" required="" />
            <label for="pdf-option" class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div class="block text-xl text-red-600 items-center justify-center">
              <FaRegFilePdf />
              </div>
            </label>
          </div>
          <div>
          <input type="checkbox" id="image-option" value="" class="hidden peer" required="" />
          <label for="image-option" class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block text-xl text-blue-600 items-center justify-center">
            <FaRegImages />
            </div>
          </label>
          </div>
          <div>
          <input type="checkbox" id="video-option" value="" class="hidden peer" required="" />
          <label for="video-option" class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block text-xl text-sky-600 items-center justify-center">
            <FaVideo />
            </div>
          </label>
          </div>
        </div>
        </div>
      )}
      {/* {activeSearch.length === 0 && (<div>No found</div>)} */}
      {/* <div className="absolute bg-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">

        <span className="flex items-center gap-4 hover:bg-gray-200 p-4"> <AiOutlineSearch /><div>test.pdf</div></span>
        <div className="flex gap-4 p-4">
          <div>
            <input type="checkbox" id="pdf-option" value="" class="hidden peer" required="" />
            <label for="pdf-option" class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div class="block text-xl text-red-600 items-center justify-center">
              <FaRegFilePdf />
              </div>
            </label>
          </div>
          <div>
          <input type="checkbox" id="image-option" value="" class="hidden peer" required="" />
          <label for="image-option" class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block text-xl text-blue-600 items-center justify-center">
            <FaRegImages />
            </div>
          </label>
          </div>
          <div>
          <input type="checkbox" id="video-option" value="" class="hidden peer" required="" />
          <label for="video-option" class="inline-flex items-center justify-between  p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block text-xl text-sky-600 items-center justify-center">
            <FaVideo />
            </div>
          </label>
          </div>
        </div>

      </div> */}

      {/* <div className="absolute bg-white p-4 w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <AiOutlineSearch />
        </div>
        <span className="pl-8">s</span>
      </div>
       */}

    </div>

  );
};
