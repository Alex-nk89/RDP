import { useMemo, ProductRows, useFormateDate } from '../Index';

const TableWrapper = ({ data, user }) => {

    let columnHeader = new Set(['Наименование']);
    let columnContent = ['productName'];
    let sections = new Set();
    let typeTag = new Set();

    const { formateDate } = useFormateDate();
    const dateUpdate = formateDate(new Date());

    const tableContent = useMemo(() => {
        // 1. Получаем все возможные столбцы в таблице.
        // 2. Делим данные по секциям.
        // 3. Внутри секций делим информацию по продуктам
        // 4. Внутри продукта делим информацию по параметрам
        // 5. Внутри параметра начинаем заполнять строку данными. Сначала заполняем названиие, позицию, е/и, шкалу и лимит.
        // Далее заполняем значениями тегов.
        if (data.find(item => item.positionVisible === true)) {
            columnContent.push('position');
            columnHeader.add('Позиция');
        }

        if (data.find(item => item.unitVisible === true)) {
            columnContent.push('unit');
            columnHeader.add('Е/и');
        }

        if (data.find(item => item.scaleVisible === true)) {
            columnContent.push('scale');
            columnHeader.add('Шкала');
        }

        if (data.find(item => item.limitVisible === true)) {
            columnContent.push('limit');
            columnHeader.add('Норма ТР');
        }

        data.forEach(item => {
            columnHeader.add(item.typeShortName);
            sections.add(item.sectionName);
            typeTag.add(item.typeShortName);
        });

        const thead = <thead>
            <tr>
                {
                    Array.from(columnHeader).map((head, index) => <th key={index}>{head}</th>)
                }
            </tr>
        </thead>

        const tbody = Array.from(sections).map((section, index) => {
            const sectionData = data.filter(item => item.sectionName === section);

            let products = new Set(
                sectionData.map(product => product.productId)
            );

            const sectionName = <tr colSpan={columnHeader.size} className='section'>
                {Array.from(columnHeader).map((item, index) => index === 0 ?
                    <td key={index}>{section}</td> :
                    <td key={index}></td>)}
            </tr>

            return <ProductRows 
                key={index} 
                index={index}
                products={products} 
                data={sectionData} 
                name={sectionName} 
                columnContent={columnContent} 
                type={typeTag}
                user={user} />
        });

        return <>{thead}
            <tbody>{tbody}</tbody></>
        //eslint-disable-next-line
    }, [data]);

    return (
        <table id='table-rt'>
            <caption>Данные получены: {dateUpdate}</caption>
            {tableContent}
        </table>
    )
}

export default TableWrapper;