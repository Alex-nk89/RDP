import Chart from 'react-apexcharts';

const ApexChart = ({ id, data }) => {
    const options = {
        chart: {
          id: id
        },
        xaxis: {
          type: 'string'
        }
      };

      const series = [ {
          data: data
        }];

    return(
        <Chart options={options} series={series}/>
    )
}

export default ApexChart;