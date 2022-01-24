import ReactApexChart from "react-apexcharts";

const ApexChart = ({ id, attributes }) => {
  console.log(attributes);

  const { tagName, calendar, color } = { ...attributes };

  const data = [{ name: '1', data: 6 }, { name: '2', data: 2 }, { name: '3', data: 1 }, { name: '4', data: 4 },
  { name: '5', data: 10 }, { name: '6', data: 8 },
  { name: '7', data: 9 }, { name: '8', data: 4 }, { name: '9', data: 5 }, { name: '10', data: 2 }];

  const series = [{
    data: data
  }];

  const options = {
    chart: {
      id: tagName,
      group: calendar,
      type: 'line',
      redrawOnParentResize: true,
      toolbar: {
        show: false
      }
    },
    colors: [color],
    grid: {
      show: true,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
    stroke: {
      width: 2
    }
  }


  return (
    <ReactApexChart series={series} options={options} height='100%' width='100%' />
  )
}

export default ApexChart;

/* const options = {
  chart: {
    id: id,
    group: 'graphic',
    toolbar: {
      show: true,
      tools: {
        zoom: false,
        pan: false
      }
    },
    locales: [{
      "name": "en",
      "options": {
        "toolbar": {
          "exportToSVG": "Загрузить SVG",
          "exportToPNG": "Загрузить PNG",
          "menu": "Меню",
          "selection": "Выбрать",
          "selectionZoom": "Выбор масштаба",
          "zoomIn": "Увеличить",
          "zoomOut": "Уменьшить",
          "pan": "Сдвинуть",
          "reset": "Сбросить увеличение"
        }
      }
    }]
  },
  xaxis: {
    type: 'category'
  },
  yaxis: {
    max: 50,
    min: -50,
    title: {
      text: 'Unit',
      style: {
        fontWeight: 300
      }
    }
  },
  colors: [parameters.color],
  grid: {
    show: true,
    strokeDashArray: 2,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
  },
  tooltip: {
    followCursor: true,
    y: {
      formatter: undefined,
      title: {
        formatter: (seriesName) => 'Значение:',
      }
    },
  }
};

const series = [{
  data: data
}]; */