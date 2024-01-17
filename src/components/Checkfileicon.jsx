import React from 'react'
import { BsFiletypePng } from "react-icons/bs";
import { FaFileImage } from "react-icons/fa";
import { BsFiletypeJpg } from "react-icons/bs";
import { SiJpeg } from "react-icons/si";
import { MdOutlineGifBox } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";
import { BsFiletypeMp4 } from "react-icons/bs";
import { BiMoviePlay } from "react-icons/bi";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { GoFileZip } from "react-icons/go";
import { CiFileOn } from "react-icons/ci";

export const Checkfileicon = (fileExtension) => {
    switch (fileExtension.fileExtension) {
        case "image/webp":
            return <div><FaFileImage /></div>
        case "image/png":
            return <div><BsFiletypePng /></div>
        case "image/jpg":
            return <div><BsFiletypeJpg /></div>
        case "image/jpeg":
            return <div><SiJpeg /></div>
        case "image/gif":
          return <div><MdOutlineGifBox /></div>
        case "application/pdf":
            return <div><FaRegFilePdf /></div>
        case "video/mp4":
            return <div><BsFiletypeMp4 /></div>
        case "video/mov":
            return <div><BiMoviePlay /></div>
        case "video/webm":
          return <div><MdOutlineVideoLibrary /></div>;
        case "application/x-zip-compressed":
            return <div><GoFileZip /></div>; 
        case "application/x-rar-compressed":
            return <div><GoFileZip /></div>;
        case "application/x-compressed":
            return <div><GoFileZip /></div>;
        default:
          return <div><CiFileOn /></div>;
      }
}
