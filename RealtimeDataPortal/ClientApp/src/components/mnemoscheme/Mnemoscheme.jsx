import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import AppPreloader from "../loader/appPreloader";

import { fetchingMnemoscheme } from '../../reducers/mnemoschemeSlice';

import './mnemoscheme.sass';

const Mnemoscheme = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { statusFetchingMnemoscheme } = useSelector(state => state.mnemoscheme);

    useEffect(() => {
        dispatch(fetchingMnemoscheme());

        //eslint-disable-next-line
    }, []);

    if(statusFetchingMnemoscheme === 'loading') {
        return <AppPreloader height='calc(100vh - 116px)' />;
    }

    return (
        <>
            <h3 className='title'>Mnemoscheme</h3>

            <div className='info-block info-block__mnemoscheme'>
                <h5>Mnemoscheme</h5>
            </div>
        </>
    );
};

export default Mnemoscheme;