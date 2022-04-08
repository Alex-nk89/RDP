import { useEffect, useState, useMemo } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useRequest } from '../../hooks/useRequest';
import { fabric } from "fabric";
import { Select } from "@mantine/core";
import { BsZoomIn } from 'react-icons/bs';

import AppPreloader from "../loader/appPreloader";
import ErrorsPage from "../errors-page/ErrorsPage";

import { fetchingMnemoscheme, fetchingMnemoschemeConfirmed, initializeMnemoscheme, fetchingMnemoschemeError } from '../../reducers/mnemoschemeSlice';

import './mnemoscheme.sass';

const Mnemoscheme = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { request, error } = useRequest();
    const { show } = useState();
    const { statusFetchingMnemoscheme, title } = useSelector(state => state.mnemoscheme);

    const [redirect, setRedirect] = useState(false);
    const [dateOfReceiptOfData, setDateOfReceiptOfData] = useState('');
    const [updateMnemoscheme, setUpdateMnemoscheme] = useState(0);
    const [listTagsId, setListTagsId] = useState([]);
    const [listTagsValue, setListTagsValue] = useState([]);
    const [mnemoschemeObjects, setMnemoschemeObjects] = useState([]);
    const [zoom, setZoom] = useState('100%');

    const followingALink = (options) => {
        const productId = options.target.dataset?.productid;

        if (productId) {
            setRedirect(productId);
        }
    };

    const rectangles = useMemo(() => {
        return mnemoschemeObjects.filter(object => object.type === 'rect').map((rect, index) => {
            const { width, height, rx, ry, stroke, strokeWidth, strokeDashArray, strokeLinecap, strokeDashoffset, strokeLinejoin,
                strokeMiterlimit, fill, fillRule, opacity, ownMatrixCache } = rect;

            const style = {
                stroke, strokeWidth, strokeDasharray: strokeDashArray?.toString(), strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity
            };

            const matrix = `matrix(${ownMatrixCache.value.join(' ')})`;

            return (
                <rect key={index} transform={matrix} style={style} width={width} height={height} rx={rx} ry={ry} x={-(width / 2)} y={-(height / 2)} />
            );
        });
        //eslint-disable-next-line
    }, [mnemoschemeObjects]);

    const texts = useMemo(() => {
        return mnemoschemeObjects.filter(object => object.type === 'text').map((textElement, index) => {
            const { text, fontSize, ownMatrixCache, width, stroke, strokeWidth, strokeDashArray, strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity, fontWeight, productId, tagId, round } = textElement;

            const style = {
                stroke, strokeWidth, strokeDasharray: strokeDashArray?.toString(), strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity, fontSize, fontWeight
            };

            const matrix = `matrix(${ownMatrixCache.value.join(' ')})`;

            const textContain = productId > 0
                ? listTagsValue.find(tag => tag?.tagId === tagId)?.value?.toFixed(round) ?? '###'
                : text;

            const textElementClass = productId > 0
                ? 'info-block info-block__mnemoscheme__tag'
                : null;

            return (
                <text key={index} transform={matrix} style={style} fontWeight={fontWeight} className={textElementClass} >
                    <tspan x={-`${width / 2}`} y='4.4' data-productid={productId} onClick={followingALink} >
                        {textContain}
                    </tspan>
                </text>
            );
        });
        //eslint-disable-next-line
    }, [mnemoschemeObjects, listTagsValue]);

    const circles = useMemo(() => {
        return mnemoschemeObjects.filter(object => object.type === 'circle').map((circle, index) => {
            const { ownMatrixCache, radius, stroke, strokeWidth, strokeDashArray, strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity } = circle;

            const style = {
                stroke, strokeWidth, strokeDasharray: strokeDashArray?.toString(), strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity
            };

            const matrix = `matrix(${ownMatrixCache.value.join(' ')})`;

            return (
                <circle key={index} transform={matrix} style={style} cx='0' cy='0' r={radius} />
            );
        });
    }, [mnemoschemeObjects]);

    const triangles = useMemo(() => {
        return mnemoschemeObjects.filter(object => object.type === 'triangle').map((triangle, index) => {
            const { left, top, stroke, strokeWidth, strokeDashArray, strokeLinecap, strokeDashoffset, strokeLinejoin,
                strokeMiterlimit, fill, fillRule, opacity, ownMatrixCache } = triangle;

            const style = {
                stroke, strokeWidth, strokeDasharray: strokeDashArray?.toString(), strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity
            };

            const matrix = `matrix(${ownMatrixCache.value.join(' ')})`;

            return (
                <polygon key={index} transform={matrix} style={style} points="-25 25,0 -25,25 25" x={left} y={top} />
            );
        });
    }, [mnemoschemeObjects]);

    const lines = useMemo(() => {
        return mnemoschemeObjects.filter(object => object.type === 'line').map((line, index) => {
            const { x1, x2, y1, y2, stroke, strokeWidth, strokeDashArray, strokeLinecap, strokeDashoffset, strokeLinejoin,
                strokeMiterlimit, fill, fillRule, opacity, ownMatrixCache } = line;

            const style = {
                stroke, strokeWidth, strokeDasharray: strokeDashArray?.toString(), strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity
            };

            const matrix = `matrix(${ownMatrixCache.value.join(' ')})`;

            return (
                <line key={index} transform={matrix} style={style} x1={x1} y1={y1} x2={x2} y2={y2} />
            );
        });
    }, [mnemoschemeObjects]);

    const paths = useMemo(() => {
        return mnemoschemeObjects.filter(object => object.type === 'path').map((pathElement, index) => {
            const { pathOffset, path, ownMatrixCache, stroke, strokeWidth, strokeDashArray, strokeLinecap,
                strokeDashoffset, strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity } = pathElement;

            const style = {
                stroke, strokeWidth, strokeDasharray: strokeDashArray?.toString(), strokeLinecap, strokeDashoffset,
                strokeLinejoin, strokeMiterlimit, fill, fillRule, opacity
            };

            const matrix = `matrix(${ownMatrixCache.value.join(' ')})`;
            const newPath = path.flatMap(path => path).join(' ');

            return (
                <path key={index} d={newPath} transform={matrix + ` translate(-${pathOffset.x} -${pathOffset.y})`} style={style} />
            );
        });
    }, [mnemoschemeObjects]);

    useEffect(() => {
        setZoom('100%');
        setMnemoschemeObjects([]);

        dispatch(fetchingMnemoscheme());

        request(`GetMnemoschemeImage?id=${id}`)
            .then(mnemoschemeData => {
                const mnemoscheme = new fabric.Canvas().loadFromJSON(mnemoschemeData[0].mnemoschemeContain);
                // Без следующей строки приложение крашится. Причина такого поведения не ясна.
                mnemoscheme.toSVG();
                const objects = mnemoscheme._objects;
                setMnemoschemeObjects(objects);
                setListTagsId(
                    objects.filter(object => object.type === 'text' && object.productId > 0).map(object => object.tagId)
                );
                dispatch(initializeMnemoscheme(mnemoschemeData));
            })
            .catch(() => dispatch(fetchingMnemoschemeError()));
        //eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        const updateMnemoschemeTimer = setTimeout(() => {
            setUpdateMnemoscheme(updateMnemoscheme => updateMnemoscheme + 1);
        }, 3000);

        if (listTagsId.length > 0) {
            request('GetMnemoschemeTagsValues', 'POST', JSON.stringify(listTagsId))
                .then(listTagsValue => setListTagsValue(listTagsValue))
                .catch(error => show('error', error));
        }

        dispatch(fetchingMnemoschemeConfirmed());

        setDateOfReceiptOfData(new Date().toLocaleString());
        return () => clearTimeout(updateMnemoschemeTimer);
        //eslint-disable-next-line
    }, [listTagsId, updateMnemoscheme]);

    if (redirect) {
        return (
            <>
                <Redirect push to={`/graphics/${redirect}`} />
            </>
        );
    }

    if (statusFetchingMnemoscheme === 'loading') {
        return <AppPreloader height='calc(100vh - 116px)' />;
    }

    if (statusFetchingMnemoscheme === 'error') {
        return <ErrorsPage {...error} />;
    }

    return (
        <div className='info-block__mnemoscheme'>
            <div className='info-block__mnemoscheme__header'>
                <h3 className='title'>{title}</h3>

                <Select
                    size='xs'
                    maxDropdownHeight={150}
                    icon={<BsZoomIn />}
                    value={zoom}
                    onChange={setZoom}
                    data={['50%', '75%', '100%', '125%', '150%', '175%', '200%']}
                />
            </div>

            <div className='info-block__mnemoscheme__canvas info-block'>
                <p className='info-block__mnemoscheme__canvas__subtitle'>
                    Данные получены: {dateOfReceiptOfData}
                </p>

                <div>
                    <svg version="1.1"
                        baseProfile="full"
                        width={zoom} height={zoom} viewBox="0 0 1200 675" preserveAspectRatio="xMinYMin meet"
                        xmlns="http://www.w3.org/2000/svg">
                        {rectangles}
                        {texts}
                        {circles}
                        {triangles}
                        {lines}
                        {paths}
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Mnemoscheme;

//canvas.add(new fabric.Path(`Q 3 0 6 3 T 3 9 T 0 15 T 3 18`, { top: 50, left: 50, stroke: '#000', fill: 'rgba(0, 0, 0, 0)' }));

//<div>
//    <div className='header'>
//        <h3 className='title'>{title}</h3>
//    </div>
//
//
//    <div className='info-block info-block__mnemoscheme'>
//        <div className='info-block__mnemoscheme__control'>
//            <p className='info-block__mnemoscheme__control__subtitle'>Данные получены: {dateOfReceiptOfData}</p>
//
//            <Select
//                size='xs'
//                maxDropdownHeight={150}
//                icon={<BsZoomIn />}
//                value={zoom}
//                onChange={setZoom}
//                data={['50%', '75%', '100%', '125%', '150%', '175%', '200%']}
//            />
//        </div>
//
//        <div className='info-block__mnemoscheme__canvas'>
//            <svg version="1.1"
//                baseProfile="full"
//                width={zoom} height={zoom} viewBox="0 0 1200 675" preserveAspectRatio="xMinYMin meet"
//                xmlns="http://www.w3.org/2000/svg">
//                {rectangles}
//                {texts}
//                {circles}
//                {triangles}
//                {lines}
//                {paths}
//            </svg>
//        </div>
//
//    </div>
//</div>