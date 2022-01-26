import { ReferenceLine, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const Chart = ({ attributes, data, isScale }) => {
    const { color, nameType } = { ...attributes };
    const { unit, scaleMinEU, scaleMaxEU, limitHi, limitHihi, limitLo, limitLolo } = { ...data.parameters };

    const styleTooltip = {
        color: "#fff",
        borderRadius: "5px",
        background: '#2C2E33',
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1), 0px 2px 5px rgba(0, 0, 0, 0.08), 0px 1px 6px rgba(0, 0, 0, 0.04)"
    };
    const itemStyle = {
        color: '#fff'
    }
    const domain = isScale ? ['auto', 'auto'] : [scaleMinEU, scaleMaxEU];

    return (
        <LineChart data={data.history} syncId={nameType} width={800} height={350}>
            <Line type="linear" dataKey="value" stroke={color} dot={false} strokeWidth={2} />

            <ReferenceLine y={limitHihi} stroke="#ff0000" strokeWidth={2} strokeDasharray="3 3" />
            <ReferenceLine y={limitHi} stroke="#ffc700" strokeWidth={2} strokeDasharray="3 3" />
            <ReferenceLine y={limitLolo} stroke="#ffc700" strokeWidth={2} strokeDasharray="3 3" />
            <ReferenceLine y={limitLo} stroke="#ff0000" strokeWidth={2} strokeDasharray="3 3" />

            <CartesianGrid strokeDasharray="1 1" />
            <XAxis dataKey="name" tickMargin={15} minTickGap={15} />
            <YAxis dataKey="value" type='number' domain={domain} tickCount={10} tickMargin={15} width={80}
                interval="preserveStart" label={{ value: unit, position: "left", angle: -90 }} />
            <Tooltip contentStyle={styleTooltip} itemStyle={itemStyle} />
        </LineChart>
    )
}
export default Chart;