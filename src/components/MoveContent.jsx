import React, { useState } from 'react'
import { CiFolderOn } from "react-icons/ci";
import { axios } from 'axios';
export const MoveContent = ({ clickedfile }) => {
    const [folder, setfolder] = useState();
    const fetchFolder = async () => {
        setfolder();
    }

    return (
        <div className='w-full'>
            <div className='w-full h-[350px] overflow-x-auto bg-gray-200'>
                <div className='text-sm flex gap-2 hover:bg-sky-200'>
                    <div><CiFolderOn /></div>
                    <div> folder 1</div>
                </div>
            </div>
        </div>
    )
}
