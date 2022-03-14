import { ResponsiveContainer, ReferenceLine, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const Chart = ({ attributes, data, isScale, width }) => {
    const { color, typeName } = { ...attributes };
    const { unit, scaleMinEU, scaleMaxEU, limitHi: { limitHi, descrLimitHi },
        limitHihi: { limitHihi, descrLimitHihi }, limitLo: { limitLo, descrLimitLo },
        limitLolo: { limitLolo, descrLimitLolo } } = { ...data.parameters };

    const styleTooltip = {
        padding: '.5rem',
        color: "#F8F9FA",
        borderRadius: "5px",
        background: '#2C2E33',
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1), 0px 2px 5px rgba(0, 0, 0, 0.08), 0px 1px 6px rgba(0, 0, 0, 0.04)"
    };
    const itemStyle = {
        color: '#F8F9FA'
    }
    const domain = isScale ? ['auto', 'auto'] : [scaleMinEU, scaleMaxEU];

    const renderTooltip = (values) => {
        const value = data.history.find(item => item.name === values.label)?.value;

        return (
            <div style={{ ...styleTooltip }}>
                <span>Время: {values.label}</span><br />
                <span>Значение: {value}</span><br />
                {limitHihi ? <><span>{`${descrLimitHihi}: ${limitHihi}`}</span><br /></> : null}
                {limitHi ? <><span>{`${descrLimitHi}: ${limitHi}`}</span><br /></> : null}
                {limitLo ? <><span>{`${descrLimitLo}: ${limitLo}`}</span><br /></> : null}
                {limitLolo ? <><span>{`${descrLimitLolo}: ${limitLolo}`}</span></> : null}
            </div>
        );
    };

    return (
        <ResponsiveContainer width='97%' aspect={3}>
            <LineChart data={data.history} syncId={typeName} width={width} height={350}>
                <Line type="linear" dataKey="value" stroke={color} dot={false} strokeWidth={2} isAnimationActive={false} />

                <ReferenceLine y={limitHihi} stroke="#ff0000" strokeWidth={2} strokeDasharray="3 3" />
                <ReferenceLine y={limitHi} stroke="#ffc700" strokeWidth={2} strokeDasharray="3 3" />
                <ReferenceLine y={limitLolo} stroke="#ffc700" strokeWidth={2} strokeDasharray="3 3" />
                <ReferenceLine y={limitLo} stroke="#ff0000" strokeWidth={2} strokeDasharray="3 3" />

                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="name" tickMargin={15} minTickGap={15} />
                <YAxis dataKey="value" type='number' domain={domain} tickCount={10} tickMargin={10} width={80}
                    interval="preserveStart" label={{ value: unit, position: 'left', angle: -90, offset: -5 }} />
                <Tooltip contentStyle={styleTooltip} itemStyle={itemStyle} content={renderTooltip} />
            </LineChart>
        </ResponsiveContainer>
    )
}
export default Chart;