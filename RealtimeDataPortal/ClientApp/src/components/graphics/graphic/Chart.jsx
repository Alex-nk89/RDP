import { ResponsiveContainer, ReferenceLine, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const Chart = ({ data }) => {
    const styleTooltip = {
        color: "#000",
        borderRadius: "5px",
        border: "1px solid rgb(241, 241, 241)",
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1), 0px 2px 5px rgba(0, 0, 0, 0.08), 0px 1px 6px rgba(0, 0, 0, 0.04)"
    };

    return (
            <LineChart width={700} height={300} />
    )
}
export default Chart;
