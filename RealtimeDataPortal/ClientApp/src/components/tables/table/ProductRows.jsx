import React from 'react';
import { CellValue } from '../Index';

const ProductRows = ({ products, data, name, columnContent, type, index }) => {
    const painted = index % 2 === 0 ? 'painted' : '';

    const product = Array.from(products).map((product, index) => {
        const productData = data.filter(item => item.attributes.productId === product);

        let parameters = new Set(
            productData.map(parameter => parameter.attributes.productsParameterId)
        );

        const parameter = Array.from(parameters).map((parameter, indexParam) => {
            const parameterData = productData.filter(item => item.attributes.productsParameterId === parameter);
            const productId = parameterData[0].attributes.productId;

            let row = Array.from(columnContent).map((name, indexCol) => {
                const rowSpan = indexParam === 0 && indexCol === 0 ? parameters.size : null;
                const parameterName = parameterData[0].attributes[name];
                const cell = indexCol === 0 ? <a href={`/graphic/${productId}`}>{parameterName}</a> : parameterName;

                return indexParam > 0 && indexCol === 0 ? null :
                    <td key={indexCol} rowSpan={rowSpan}>{cell}</td>;
            });

            Array.from(type).forEach((type, index) => {
                const parameter = parameterData.find(item => item.attributes.typeShortName === type);
                const round = parameter?.attributes.round;

                row.push(parameter ?
                    <CellValue key={`${indexParam}-${index}`} parameter={parameter} round={round} /> : <td key={`${indexParam}-${index}`}></td>);
            });

            return <tr key={indexParam} className={painted}>{row}</tr>;
        });

        return <React.Fragment key={index}>{parameter}</React.Fragment>
    });

    return (
        <>{name}{product}</>
    )
}

export default ProductRows;