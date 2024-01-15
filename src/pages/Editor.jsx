import React, { useState, useEffect } from 'react'
import { useSortable } from "@dnd-kit/sortable";
import { Box } from "grommet";
import { CSS } from "@dnd-kit/utilities";
import { IoMdAddCircleOutline } from "react-icons/io";
import ReactApexChart from "react-apexcharts";
import { useStateContext } from '../contexts/ContextProvider';
import { Modals } from "../components";
import { Createchart } from './Createchart';

import {
  DndContext, closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from "@dnd-kit/sortable";

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
    animations: {
      enabled: false,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
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

export const Editor = () => {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState([
    { id: "1", type: "line" },
    { id: "2", type: "area" },
    { id: "3", type: "bar" },
    { id: "4", type: "bar" },
    { id: "5", type: "bar" },
  ]);
  const [weatherData, setWeatherData] = useState([]);
  const apiKey = "c1a9ce00ca063b004276bf58a4397140";
  const city = "Bangkok";
  const { openModal, closeModal, isModalOpen } = useStateContext();

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data.list));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const chartSeries = [
    {
      name: "Temperature",
      data: weatherData.map((data) => ({
        x: data.dt_txt, // Convert timestamp to Date
        y: Number(data.main.temp - 273.15).toFixed(2),
      })),
    },
  ];
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);

    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        console.log(oldIndex, newIndex)
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const SortableItem = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: props.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? "100" : "auto",
      opacity: isDragging ? 0.3 : 1
    };

    return (
      <div ref={setNodeRef} style={style}  {...listeners} {...attributes}>
        <Box>
          <div
            style={{
              border: "1px solid balck",
              width: '200px',
              height: '200px',
              backgroundColor: 'grey',
              borderColor: "black"
            }}
          >
            {props.value}
            {/* <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type={props.value}
                    height={350}
                    width={"100%"}
                  /> */}
          </div>
        </Box>
      </div>
    );
  };

  return (
    <div className='p-12'>
      <div>
        <div className='text-xl mb-4 flex items-center'>See created charts <div className='ml-2 hover:bg-gray-200 rounded-md p-2' onClick={openModal} ><IoMdAddCircleOutline className='text-xl' /></div></div>
      </div>
      <div>

        <Modals isOpen={isModalOpen} onClose={closeModal}>
          <h1 className="text-xl font-bold mb-4">Create charts template</h1>
          <Createchart />
          <button onClick={closeModal} className="mt-4 bg-gray-500 text-white p-2 rounded">
            Close Modal
          </button>
        </Modals>
      </div>
      <div>


        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Box
            flex={true}
            wrap={true}
            direction="row"
            className='w-full'
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((ids) => (
                <SortableItem key={ids.id} id={ids} value={ids.type} />
              ))}
              <DragOverlay>
                {activeId ? (
                  <div
                    style={{
                      width: "300px",
                      height: "300px",
                      backgroundColor: "red"
                    }}
                  ></div>
                ) : null}
              </DragOverlay>
            </SortableContext>
          </Box>
        </DndContext>
      </div>
    </div>
  );

}

