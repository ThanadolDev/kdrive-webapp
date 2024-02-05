import React,{useEffect} from 'react'
import { MainDrive } from "./index";
import { useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";


export const FolderContents = ({fetchstate,shareStatus}) => {
  const { id } = useParams();
  const {
    setUrlParams,
    currentParams,
    
  } = useStateContext();
  useEffect(() => {
    setUrlParams(id)
  },[])
  return (
    <div>
        <MainDrive fetchstate={fetchstate} folderId={id} shareStatus={shareStatus}/>
    </div>
  )
}
