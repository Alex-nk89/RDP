import { useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useRequest } from '../../hooks/useRequest';
import { fabric } from "fabric";

import AppPreloader from "../loader/appPreloader";
import ErrorsPage from "../errors-page/ErrorsPage";

import { fetchingMnemoscheme, initializeMnemoscheme, fetchingMnemoschemeError } from '../../reducers/mnemoschemeSlice';

import './mnemoscheme.sass';

const Mnemoscheme = () => {
    const { id } = useParams();
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();
    const { request, error } = useRequest();
    const { statusFetchingMnemoscheme, title } = useSelector(state => state.mnemoscheme);
    const [svg, setSVG] = useState(null);

    useEffect(() => {
        dispatch(fetchingMnemoscheme());

        request(`GetMnemoscheme?id=${id}`)
            .then(result => {
                dispatch(initializeMnemoscheme(result));

                const newSVG = [];

                const mnemoscheme = new fabric.Canvas().loadFromJSON(result[0].mnemoschemeContain);
                console.log(mnemoscheme.toSVG());

                mnemoscheme._objects.forEach((object, index) => {
                    console.log(object);

                    const { left, top, radius, width, height, x1, x2, y1, y2,
                        fill, stroke, strokeWidth, strokeDasharray, strokeLinecap, text,
                        strokeDashoffset, strokeLinejoin, strokeMiterlimit, fillRule, opacity, ownMatrixCache } = object;

                    const matrix = `matrix(${ownMatrixCache.value.join(' ')})`;

                    const style = {
                        stroke,
                        strokeWidth,
                        strokeDasharray,
                        strokeLinecap,
                        strokeDashoffset,
                        strokeLinejoin,
                        strokeMiterlimit,
                        fill,
                        fillRule,
                        opacity
                    };

                    switch (object.type) {
                        case 'rect':
                            newSVG.push(
                                <rect
                                    key={index}
                                    style={style}
                                    transform={matrix}
                                    width={height}
                                    height={width}
                                    x={-(width / 2)}
                                    y={-(height / 2)}
                                />
                            );
                            break;
                        case 'circle':
                            newSVG.push(
                                <circle
                                    key={index}
                                    transform={matrix}
                                    style={style}
                                    cx='0'
                                    cy='0'
                                    r={radius}
                                />
                            );
                            break;
                        case 'triangle':
                            newSVG.push(
                                <polygon
                                    key={index}
                                    transform={matrix}
                                    style={style}
                                    points="-25 25,0 -25,25 25"
                                    x={left}
                                    y={top}
                                />
                            );
                            break;
                        case 'line':
                            newSVG.push(
                                <line key={index} transform={matrix} style={style} x1={x1} y1={y1} x2={x2} y2={y2} />
                            );
                            break;
                        case 'text':
                            newSVG.push(
                                <text key={index} transform={matrix}>
                                    <tspan x={-`${width / 2}`} y='4.4'>{text}</tspan>
                                </text>
                            );
                            break;
                        default:
                            break;
                    }
                });

                setSVG(newSVG);

                mnemoscheme.on('mouse:down', followingALink);

                return mnemoscheme.on('mouse:down', followingALink);
            })
            .catch(() => dispatch(fetchingMnemoschemeError()));
        //eslint-disable-next-line
    }, []);

    const followingALink = (options) => {
        console.log(options.target)
        if (options.target?.productId) {
            //options.target?.productId();
            setRedirect(true);
        }
    };

    if (redirect) {
        return (
            <>
                <Redirect push to='/graphics/1' />
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
        <div>
            <h3 className='title'>{title}</h3>

            <div className='info-block info-block__mnemoscheme'>
                <svg version="1.1"
                    baseProfile="full"
                    width="100%" height="100%" viewBox="0 0 1200 675" preserveAspectRatio="xMinYMin meet"
                    xmlns="http://www.w3.org/2000/svg">
                    {svg}
                </svg>
            </div>
        </div>
    );
};

export default Mnemoscheme;