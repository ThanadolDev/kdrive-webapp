import React,{useState,useEffect} from 'react'
import { MainDrive } from "./index";
import { useLocation } from 'react-router-dom';
export const SearchPage = ({ fetchstate, shareStatus }) => {
  const [url, setUrl] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setUrl(searchParams.get('query') || '');
  }, [location.search]); // Include location.search in the dependency array

  return (
    <MainDrive fetchstate={fetchstate} shareStatus={shareStatus} Urlquery={url} />
  );
};