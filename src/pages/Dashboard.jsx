import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { SortableContext,rectSortingStrategy } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import {
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const chartDivs = [
  { dataid: "1", type: "line" },
  { dataid: "2", type: "area" },
  { dataid: "3", type: "bar" },
  { dataid: "4", type: "bar" },
  { dataid: "5", type: "bar" },
];

export const Dashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const apiKey = "c1a9ce00ca063b004276bf58a4397140";
  const city = "Bangkok";
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data.list));
  }, []);

  const chartOptions = {
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2,
    },
    chart: {
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },

        autoSelected: "zoom",
      },
      zoom: {
        enabled: false,
        type: "x",
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: "#90CAF9",
            opacity: 0.4,
          },
          stroke: {
            color: "#0D47A1",
            opacity: 0.4,
            width: 1,
          },
        },
      },
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Average High & Low Temperature",
      align: "left",
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    yaxis: {
      title: {
        text: "Temp",
      },
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      shared: false,
    },
  };

  function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
      id: "droppable",
    });
    const style = {
      color: isOver ? "green" : undefined,
    };

    return (
      <div ref={setNodeRef} style={style}>
        {props.children}
      </div>
    );
  }

  function Draggable(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: props.draggableId,
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    return (
      <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {props.children}
      </button>
    );
  }

  const chartSeries = [
    {
      name: "Temperature",
      data: weatherData.map((data) => ({
        x: data.dt_txt, // Convert timestamp to Date
        y: Number(data.main.temp - 273.15).toFixed(2),
      })),
    },
  ];
  function SortableItem({ div, children }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: div.dataid,
    });
  
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;
  
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {children}
      </div>
    );
  }
  function handleDragEnd(event) {
    if (event.over && event.over.id === "droppable") {
      setIsDropped(true);
    }
  }

  const [isDropped, setIsDropped] = useState(false);


  return (
    <div className="p-12 ">
      <p className="text-xl mb-4">Dashboard</p>{" "}
      <div className="flex w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={chartDivs} strategy={rectSortingStrategy}> */}
          {chartDivs.map((div) => (
            
            // <SortableItem  key={div.dataid} div={div}>
              <div className="bg-white dark:bg-[#42464D] p-4 rounded-lg border-slate-300 border-1">
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type={div.type}
                  height={350}
                  width={"100%"}
                />
              </div>
            // </SortableItem >
          ))}
          {/* </SortableContext>
        </DndContext> */}
      </div>
    </div>
  );
};
