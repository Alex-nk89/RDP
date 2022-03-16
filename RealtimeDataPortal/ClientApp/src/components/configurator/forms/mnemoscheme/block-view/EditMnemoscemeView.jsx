import {
    FabricJSCanvas
} from '..';

export const EditMnemoschemeView = ({ onReady }) => {

    return (
        <div className='info-block info-block__mnemoscheme_view'>
            <FabricJSCanvas onReady={onReady} className='canvas'/>
        </div>
    );
};