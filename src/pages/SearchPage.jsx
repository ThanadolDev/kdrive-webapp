import React from 'react'
import { MainDrive } from "./index";
import { useLocation } from 'react-router-dom';
export const SearchPage = ({fetchstate,shareStatus}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const Urlquery = searchParams.get('query');
  return (
   <MainDrive fetchstate={fetchstate}  shareStatus={shareStatus} Urlquery={Urlquery}/>

  )
}
