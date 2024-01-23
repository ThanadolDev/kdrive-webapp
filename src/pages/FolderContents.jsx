import React from 'react'
import { MainDrive } from "./index";
import { useParams } from "react-router-dom";

export const FolderContents = ({fetchstate}) => {
  const { id } = useParams();
  return (
    <div>
        {/* FolderContents */}
        {/* <p>Folder ID: {id}</p> */}
        <MainDrive fetchstate={fetchstate} folderId={id}/>
    </div>
  )
}
