import React, { useState, useEffect } from 'react'
import ReactApexChart from "react-apexcharts";
import { ChartOptions } from '../components';

export const Createchart = () => {
    const mockSeriesData = [10, 41, 35, 51, 49, 62, 69, 91, 148, 120];

    return (
        <div className='flex'>
            <div className='w-[50%]'>
               test1
            </div>
            <div className='w-[50%]'>
                test2
                <ReactApexChart
                    options={ChartOptions()}
                    series={[{ data: mockSeriesData }]}
                    type={'bar'}
                    height={350}
                    width={"100%"}
                />
            </div>
        </div>
    )
}
