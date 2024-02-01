import React, { useState,useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
const pathurl = `http://localhost`;
// const pathurl = `http://192.168.55.37`;
export const NavSearchbar = () => {
  const [activeSearch, setActiveSearch] = useState([]);
  const timerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    console.log(e.target)
    if (e.target.value === "") {
      setActiveSearch([]);
      return false;
    }
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm !== "") {
      const fetchData = async () => {
        try {
          const response = await fetch(`${pathurl}:7871/searchfile`, {
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
          setActiveSearch(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }
  }, [searchTerm]);
  
  
  return (
    <div className="w-[400px] relative">
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2">
      <AiOutlineSearch />
    </div>
    <input
      type="search"
      placeholder="Type Here"
      className="pl-8 w-full border-1 p-2 rounded-full"
      onChange={(e) => handleSearch(e)}
    />
  </div>

  {activeSearch.length > 0 && (
    <div className="absolute top-20 p-4 text-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
      {activeSearch.map((s) => (
        <span>{s}</span>
      ))}
    </div>
  )}
</div>

  );
};
