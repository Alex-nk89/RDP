import {
    useState, useEffect, useMemo, useRef,
    LoadingOverlay,
    AppPreloader, ErrorsPage, useRequest, Chart, TableForGraphic, useFormateDate
} from '../Index';

const Graphic = ({ attributes, date, isScale, isVisibleTable }) => {
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution, visibleToGraphic,
        position, isDateOffset } = { ...attributes };
    const { request, proccess, setProccess, error } = useRequest();
    const { formateDate } = useFormateDate();
    const graphicRef = useRef();

    const [data, setData] = useState([]);

    const chart = useMemo(() => <Chart attributes={attributes} data={data} isScale={isScale} width={900} />,
        //<ApexChart data={data} attributes={attributes} isScale={isScale} />
        //eslint-disable-next-line
        [data, isScale]);

    const table = useMemo(() => <TableForGraphic attributes={attributes} data={data} />,
        //eslint-disable-next-line
        [data]);

    const graphic = (
        <div className='info-block' ref={graphicRef}>
            <div className='header'>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>
            </div>

            <div id={`${tagName}`} className='graphic'>
                <LoadingOverlay visible={proccess === 'loading'} />
                {chart}
                {(isVisibleTable && proccess === 'confirmed' && calendar !== 'range') ? table : null}
            </div>
        </div>
    );

    useEffect(() => {
        if (visibleToGraphic)
            request('GetGraphic', 'POST', JSON.stringify({
                TagName: tagName,
                StartDate: date.start,
                EndDate: date.end,
                Round: round,
                WwResolution: wwResolution,
                Calendar: calendar,
                ServerConnection: serverConnection,
                IsDateOffset: isDateOffset
            }))
                .then(dataGraphic => {
                    setData({
                        history: dataGraphic.history.map((item, index) => {
                            const startDate = dataGraphic.history[0].dateTime;
                            const endDate = dataGraphic.history[dataGraphic.history.length - 1].dateTime;

                            return {
                                name: formateDate(item.dateTime, calendar, index, dataGraphic.history.length, startDate, endDate),
                                value: item.value
                            }
                        }),
                        parameters: dataGraphic.parameters
                    });

                    setProccess('confirmed');
                })
                .catch(error => { });
        /* setData({
            history: [
                { name: '01.01.2022 10:00:00', value: 4 }, { name: '01.01.2022 10:00:00', value: 4 }, { name: '01.01.2022 10:00:00', value: 4 }, { name: '01.01.2022 10:00:00', value: 4 },
                { name: '01.01.2022 11:00:00', value: 2 }, { name: '01.01.2022 11:00:00', value: 2 }, { name: '01.01.2022 11:00:00', value: 2 }, { name: '01.01.2022 11:00:00', value: 2 },
                { name: '01.01.2022 12:00:00', value: 3 }, { name: '01.01.2022 12:00:00', value: 3 }, { name: '01.01.2022 12:00:00', value: 3 }, { name: '01.01.2022 12:00:00', value: 3 },
                { name: '01.01.2022 13:00:00', value: 5 }, { name: '01.01.2022 13:00:00', value: 5 }, { name: '01.01.2022 13:00:00', value: 5 }, { name: '01.01.2022 13:00:00', value: 5 },
                { name: '01.01.2022 14:00:00', value: 7 }, { name: '01.01.2022 14:00:00', value: 7 }, { name: '01.01.2022 14:00:00', value: 7 }, { name: '01.01.2022 14:00:00', value: 7 },
                { name: '01.01.2022 15:00:00', value: 2 }, { name: '01.01.2022 15:00:00', value: 2 }, { name: '01.01.2022 15:00:00', value: 2 }, { name: '01.01.2022 15:00:00', value: 2 },
                { name: '01.01.2022 16:00:00', value: 1 }, { name: '01.01.2022 16:00:00', value: 1 }, { name: '01.01.2022 16:00:00', value: 1 }, { name: '01.01.2022 16:00:00', value: 1 },
                { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 },
                { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 },
                { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 },
                { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 },
                { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 }, { name: '01.01.2022 17:00:00', value: 4 },
            ],
            parameters: { unit: 'кг', scaleMinEU: -20, scaleMaxEU: 20 }
        }); */
        /* setData({
            history: [
                { dateTime: '01.01.2022 10:00:00', value: 4 },
                { dateTime: '01.01.2022 11:00:00', value: 2 },
                { dateTime: '01.01.2022 12:00:00', value: 3 },
                { dateTime: '01.01.2022 13:00:00', value: 5 },
                { dateTime: '01.01.2022 14:00:00', value: 7 },
                { dateTime: '01.01.2022 15:00:00', value: 2 },
                { dateTime: '01.01.2022 16:00:00', value: 1 },
                { dateTime: '01.01.2022 17:00:00', value: 4 }
            ]
        }); */
        //setProccess('confirmed');

        //eslint-disable-next-line
    }, [date]);

    switch (proccess) {
        case 'loading':
            return date.start ? graphic : <AppPreloader height='100px' />;
        case 'error':
            return <ErrorsPage {...error} height='400px' />;
        case 'confirmed':
            return graphic;
        default:
            return null;
    }
}

export default Graphic