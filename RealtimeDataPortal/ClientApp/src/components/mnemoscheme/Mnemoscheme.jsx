import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useRequest } from '../../hooks/useRequest';
import { fabric } from "fabric";

import AppPreloader from "../loader/appPreloader";
import ErrorsPage from "../errors-page/ErrorsPage";

import { fetchingMnemoscheme, initializeMnemoscheme, fetchingMnemoschemeError } from '../../reducers/mnemoschemeSlice';

import './mnemoscheme.sass';

const Mnemoscheme = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { request, error } = useRequest();
    const { statusFetchingMnemoscheme, mnemoschemeData, fetchingMnemoschemeConfirmed } = useSelector(state => state.mnemoscheme);

    //const [mnemoscheme, setMnemoscheme] = useState(new fabric.Canvas('mnemoscheme'));

    useEffect(() => {
        //dispatch(fetchingMnemoscheme());

        /* request(`GetMnemoscheme?id=${id}`)
            .then(result => new fabric.Canvas('mnemoscheme'))
            .catch(() => dispatch(fetchingMnemoschemeError())); */

            const mnemoscheme = new fabric.StaticCanvas('mnemoscheme',{
                width: 700,
                height: 500,
            });
            mnemoscheme.loadFromJSON({"version":"4.6.0","objects":[{"type":"rect","id":"234","version":"13.45.0","originX":"left","originY":"top","left":50,"top":50,"width":20,"height":20,"fill":"green","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"circle","version":"4.6.0","originX":"left","originY":"top","left":100,"top":100,"width":100,"height":100,"fill":"red","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":50,"startAngle":0,"endAngle":6.283185307179586},{"type":"rect","version":"4.6.0","originX":"left","originY":"top","left":29.03,"top":112.99,"width":50,"height":50,"fill":"#fff","stroke":"#000","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"rgba(0, 0, 0, 0)"})

            mnemoscheme.on('mouse:down', function(options){
                if(options.target){
                    console.log(options.target.version)
                }
            });

        //eslint-disable-next-line
    }, []);

    if (statusFetchingMnemoscheme === 'loading') {
        return <AppPreloader height='calc(100vh - 116px)' />;
    }

    if (statusFetchingMnemoscheme === 'error') {
        return <ErrorsPage {...error} />;
    }

    return (
        <div>
            <h3 className='title'>Mnemoscheme</h3>

            <div className='info-block info-block__mnemoscheme'>
                <canvas id='mnemoscheme' />
            </div>
        </div>
    );
};

export default Mnemoscheme;