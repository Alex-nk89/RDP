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
            //mnemoscheme.loadFromJSON(componentInfo.mnemoscheme.mnemoschemeContain);
            const _objects = new fabric.Canvas().loadFromJSON(componentInfo.mnemoscheme.mnemoschemeContain)._objects.map(object => object);

            _objects.forEach(object => {

                if (object.type === 'text') {
                    object.toObject = (function (toObject) {
                        return function () {
                            return fabric.util.object.extend(toObject.call(this), {
                                productId: this.productId,
                                tagId: this.tagId,
                                tagName: this.tagName,
                                round: this.round,
                                isAutomaticColorSelection: this.isAutomaticColorSelection
                            });
                        };
                    })(object.toObject);

                    mnemoscheme.add(object);
                } else {
                    mnemoscheme.add(object);
                }
            });
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