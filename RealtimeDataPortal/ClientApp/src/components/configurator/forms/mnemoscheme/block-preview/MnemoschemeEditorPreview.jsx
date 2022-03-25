import {
    useEffect,
    useSelector,
    fabric
} from '..';

export const MnemoschemeEditorPreview = ({ setMnemoscheme }) => {
    const componentInfo = useSelector(state => state.configurator.componentInfo);

    useEffect(() => {

        const mnemoscheme = new fabric.Canvas('mnemoscheme', {
            width: 1200,
            height: 675
        });

        if (componentInfo.mnemoscheme.mnemoschemeContain.length > 0) {
            mnemoscheme.loadFromJSON(componentInfo.mnemoscheme.mnemoschemeContain);
        }

        setMnemoscheme(mnemoscheme);

        //eslint-disable-next-line
    }, []);

    return (
        <div className='info-block__mnemoscheme-editor__canvas'>
            <canvas id='mnemoscheme'></canvas>
        </div>
    )
}