import React from 'react'

export const ChartOptions = () => {

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
      return(
        <React.Fragment>
        {/* You can include additional components or JSX here */}
        {/* If not needed, you can remove the React.Fragment */}
      </React.Fragment>
    
      )
}
