import {
    useEffect, useRef,
    useSelector,
    fabric
} from '..';

export const MnemoschemeEditorPreview = ({ setMnemoscheme }) => {
    const mnemoschemeRef = useRef();
    const componentInfo = useSelector(state => state.configurator.componentInfo);

    useEffect(() => {
        const mnemoscheme = new fabric.Canvas('mnemoscheme', {
            width: mnemoschemeRef.current.clientWidth - 60,
            height: mnemoschemeRef.current.clientHeight - 60
        });

        if (componentInfo.mnemoscheme.mnemoschemeContain.length > 0) {
            mnemoscheme.loadFromJSON(componentInfo.mnemoscheme.mnemoschemeContain);
        }

        setMnemoscheme(mnemoscheme);

        //eslint-disable-next-line
    }, []);

    return (
        <div className='info-block info-block__mnemoscheme-editor__canvas' ref={mnemoschemeRef}>
            <canvas id='mnemoscheme' />
        </div>
    )
}