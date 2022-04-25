import {
    useEffect,
    useSelector,
    fabric
} from '..';

export const MnemoschemeEditorPreview = ({ setMnemoscheme }) => {
    const componentInfo = useSelector(state => state.configurator.componentInfo);

    useEffect(() => {

        const mnemoscheme = new fabric.Canvas('mnemoscheme', {
            width: 1000,
            height: 440,
        });

        // Ограничительные линии для холста
        mnemoscheme.add(new fabric.Line([1, 1, -1, 441], { stroke: '#e7e7e7' })
            .set({ selectable: false, hoverCursor: 'unset' }));
        mnemoscheme.add(new fabric.Line([-1, -1, 1001, -1], { stroke: '#e7e7e7' })
            .set({ selectable: false, hoverCursor: 'unset' }));
        mnemoscheme.add(new fabric.Line([1001, -1, 1001, 441], { stroke: '#e7e7e7' })
            .set({ selectable: false, hoverCursor: 'unset' }));
        mnemoscheme.add(new fabric.Line([-1, 441, 1001, 441], { stroke: '#e7e7e7' })
            .set({ selectable: false, hoverCursor: 'unset' }));

        if (componentInfo.mnemoscheme.mnemoschemeContain.length > 0) {
            const loadedMnemoscheme = new fabric.Canvas().loadFromJSON(componentInfo.mnemoscheme.mnemoschemeContain);

            mnemoscheme.setBackgroundColor(loadedMnemoscheme.backgroundColor, mnemoscheme.renderAll.bind(mnemoscheme));

            const _objects = loadedMnemoscheme._objects.map(object => object);

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
            <canvas id='mnemoscheme' ></canvas>
        </div>
    )
}