import {
    useEffect, useRef,
    useSelector,
    fabric
} from '..';

export const MnemoschemeEditorPreview = ({ setMnemoscheme, mnemoscheme }) => {
    const componentInfo = useSelector(state => state.configurator.componentInfo);
    const canvasContainerRef = useRef();
    const width = 1920;
    const height = 920;

    useEffect(() => {
        const mnemoscheme = new fabric.Canvas('mnemoscheme', { width, height });
        const zoom = (canvasContainerRef?.current?.clientWidth - 55) / 1920;
        mnemoscheme.setZoom(zoom);

        // Ограничительные линии для холста
        if (componentInfo.mnemoscheme.mnemoschemeContain.length === 0) {
            mnemoscheme.add(new fabric.Line([-2, -2, -2, mnemoscheme.getHeight() + 2], { stroke: '#787878' })
                .set({ selectable: false, hoverCursor: 'unset' }));
            mnemoscheme.add(new fabric.Line([-2, -2, mnemoscheme.getWidth() + 2, -2], { stroke: '#787878' })
                .set({ selectable: false, hoverCursor: 'unset' }));
            mnemoscheme.add(new fabric.Line([mnemoscheme.getWidth() + 2, -2, mnemoscheme.getWidth() + 2, mnemoscheme.getHeight() + 2], { stroke: '#787878' })
                .set({ selectable: false, hoverCursor: 'unset' }));
            mnemoscheme.add(new fabric.Line([-2, mnemoscheme.getHeight() + 2, mnemoscheme.getWidth() + 2, mnemoscheme.getHeight() + 2], { stroke: '#787878' })
                .set({ selectable: false, hoverCursor: 'unset' }));
        }

        if (componentInfo.mnemoscheme.mnemoschemeContain.length > 0) {
            const loadedMnemoscheme = new fabric.Canvas().loadFromJSON(componentInfo.mnemoscheme.mnemoschemeContain);
            console.log(loadedMnemoscheme._objects[0])

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
        <div className='info-block__mnemoscheme-editor__canvas' ref={canvasContainerRef}>
            <canvas id='mnemoscheme' ></canvas>
        </div>
    )
}