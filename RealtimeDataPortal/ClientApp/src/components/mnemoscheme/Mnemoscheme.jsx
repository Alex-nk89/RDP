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
                console.log(result[0].mnemoschemeContain)

                const mnemoscheme = new fabric.Canvas('mnemoscheme', {
                    width: 900,
                    height: 620
                }).loadFromJSON(result[0].mnemoschemeContain);

                mnemoscheme._objects.forEach(object => {
                    object.lockMovementX = true;
                    object.lockMovementY = true;
                    object.selectable = false;
                    object?.productId ? object.hoverCursor = 'pointer' : object.hoverCursor = 'default';

                    if (object.type === 'rect') {
                        newSVG.push(
                            <rect
                                width={object.width * object.scaleX}
                                height={object.height * object.scaleY}
                                fill={object.fill}
                                stroke={object.stroke}
                                onClick={() => console.log('click')}
                            />
                        );
                    }

                    setSVG(newSVG);
                });

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
                <canvas id='mnemoscheme'></canvas>
                <svg version="1.1"
                    baseProfile="full"
                    width="100%" height="100%"
                    xmlns="http://www.w3.org/2000/svg">
                    {svg}
                </svg>
            </div>
        </div>
    );
};

export default Mnemoscheme;