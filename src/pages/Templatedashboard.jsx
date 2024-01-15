import React from 'react'
import { IoMdAddCircleOutline } from "react-icons/io";
import { Box } from "grommet";
import { Link, NavLink } from "react-router-dom";

export const Templatedashboard = () => {
    return (
        <div className='m-12'>
            <div className='text-xl flex items-center mb-4'>List of Dashboard
                <div className='ml-2 hover:bg-gray-200 rounded-md p-2'>
                <NavLink
                to={`/editdash/create`}
                key={"Editdash"}
                
              >
                <IoMdAddCircleOutline className="mt-0.5 text-xl"/>
              </NavLink>
                    {/* <IoMdAddCircleOutline /> */}
                </div>
            </div>
            <div>
                <div className='flex'>
                    <Box
                        flex={true}
                        wrap={true}
                        direction="row"
                        className='w-full gap-2'
                    >
                        <Box className=''>
                            <div
                                style={{
                                    border: "1px solid balck",
                                    width: '200px',
                                    height: '100px',
                                    backgroundColor: 'grey',
                                    borderColor: "black"
                                }}
                            >
                                test
                            </div>
                        </Box>
                        <Box>
                            <div
                                style={{
                                    border: "1px solid balck",
                                    width: '200px',
                                    height: '100px',
                                    backgroundColor: 'grey',
                                    borderColor: "black"
                                }}
                            >
                                test
                            </div>
                        </Box>
                        <Box>
                            <div
                                style={{
                                    border: "1px solid balck",
                                    width: '200px',
                                    height: '100px',
                                    backgroundColor: 'grey',
                                    borderColor: "black"
                                }}
                            >
                                test
                            </div>
                        </Box>
                        <Box>
                            <div
                                style={{
                                    border: "1px solid balck",
                                    width: '200px',
                                    height: '100px',
                                    backgroundColor: 'grey',
                                    borderColor: "black"
                                }}
                            >
                                test
                            </div>
                        </Box>
                        <Box>
                            <div
                                style={{
                                    border: "1px solid balck",
                                    width: '200px',
                                    height: '100px',
                                    backgroundColor: 'grey',
                                    borderColor: "black"
                                }}
                            >
                                test
                            </div>
                        </Box>
                        <Box>
                            <div
                                style={{
                                    border: "1px solid balck",
                                    width: '200px',
                                    height: '100px',
                                    backgroundColor: 'grey',
                                    borderColor: "black"
                                }}
                            >
                                test
                            </div>
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    )
}
