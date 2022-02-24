import ReactApexChart from "react-apexcharts";

const ApexChart = ({ data, attributes, isScale }) => {
  console.log(attributes)

  const { color, calendar, tagName } = { ...attributes };

  const series = [{
    name: 'Значение',
    data: data.history.map(data => ({
      x: data.dateTime,
      y: data.value
    }))
  }];

  const options = {
    chart: {
      id: tagName,
      type: 'line',
      group: calendar,
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        tools: {
          selection: false,
          pan: false
        }
      }
    },
    grid: {
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
      }
    },
    colors: [color],
    stroke: {
      width: 3
    },
    yaxis: {
      min: isScale ? null : 0,
      max: isScale ? null : 100
    }
  };

  return (
    <ReactApexChart height='100%' width={800} series={series} options={options} />
  );
}

export default ApexChart;