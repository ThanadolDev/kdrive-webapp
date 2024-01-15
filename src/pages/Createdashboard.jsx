import React from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { Box } from "grommet";
import { CgAddR } from "react-icons/cg";
import { Modals, Addchart } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

export const Createdashboard = () => {
  const { openModal, closeModal, isModalOpen } = useStateContext();
  return (
    <div className='m-12'>
      <div className='flex items-center mb-4'>
        <div className='mr-2 hover:bg-gray-200 rounded-md p-2'>
          <NavLink
            to={`/editdash/`}
            key={"Createdash"}
          >
            <IoMdArrowBack className="mt-0.5 text-xl" />
          </NavLink>
        </div>
        <div>
          <p>
            Create dashboard page
          </p>
        </div>
      </div>
      <div className='rounded-md bg-gray-100 h-[75vh] p-4'>
        <div className='flex'>
          <Box flex={true}
            wrap={true}
            direction="row"
            className='w-full gap-2'>
            <Box>
              <div className='w-[300px] h-[200px] bg-white '>
                test
              </div>
            </Box>
            <Box
              justify="center"
              align="center"
              onClick={openModal}
            >
              <div className='w-[300px] h-[200px] border-dashed border-2 border-grey-300 hover:border-gray-400  hover:cursor-pointer rounded-md'>
                <div className="flex flex-col justify-center items-center h-full ">
                  <div><CgAddR className='size-20' /></div>
                  <div>Add more chart</div>
                </div>
              </div>
            </Box>
          </Box>
        </div>
      </div>
      <Modals isOpen={isModalOpen} onClose={closeModal}>
          <h1 className="text-xl font-bold mb-4">Create charts template</h1>
          <Addchart/>
          <button onClick={closeModal} className="mt-4 bg-gray-500 text-white p-2 rounded">
            Close Modal
          </button>
        </Modals>
    </div>
  )
}
