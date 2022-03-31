import {
    useState, useEffect,
    useSelector,
    Space, Stepper,
    useNotification, useRequest,
    MnemoschemeEditorForm, MnemoschemeEditorPreview, MnemoschemeEditorPanelCreateElements, MnemoschemeEditorPanelChangeElements
} from '.';
import './mnemoscheme.sass';

export const EditMnemoscheme = ({ action, form, nameRef, submitForm, addAccessIcon, multiSelect, loadingForButton }) => {
    const title = action === 'create' ? 'Создание мнемосхемы' : 'Редактирование мнемосхемы';
    let copiedObject = null;

    const { request } = useRequest();
    const { show } = useNotification();

    const componentInfo = useSelector(state => state.configurator.componentInfo);

    const [activeStep, setActiveStep] = useState(0);
    const [mnemoscheme, setMnemoscheme] = useState(null);

    const saveMnemoscheme = () => {

        const component = { ...componentInfo, mnemoscheme: { ...componentInfo.mnemoscheme, mnemoschemeContain: JSON.stringify(mnemoscheme) } };

        request('AddChangeElement', 'POST', JSON.stringify(component))
            .then(result => show('success', result.message))
            .catch(error => show('error', error));
    };

    const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));

    const zoomMnemoscheme = (event) => {
        const delta = event.e.deltaY;
        let zoom = mnemoscheme.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 5) zoom = 5;
        if (zoom < 0.1) zoom = 0.1;
        mnemoscheme.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
        event.e.preventDefault();
        event.e.stopPropagation();
    };

    function grabCanvas(event) {
        const evt = event.e;
        if (evt.altKey === true) {
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        }
    };

    function moveCanvas(event) {
        if (this.isDragging) {
            const e = event.e;
            let vpt = this.viewportTransform;
            vpt[4] += e.clientX - this.lastPosX;
            vpt[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    };

    function letGoCanvas() {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
    };

    const moveChoiseElement = (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code) && mnemoscheme) {
            const activeObjects = mnemoscheme.getActiveObjects();

            switch (event.code) {
                case 'ArrowUp':
                    activeObjects.forEach(object => object.set({ top: object.top - 1 }));
                    break;
                case 'ArrowDown':
                    activeObjects.forEach(object => object.set({ top: object.top + 1 }));
                    break;
                case 'ArrowLeft':
                    activeObjects.forEach(object => object.set({ left: object.left - 1 }));
                    break;
                case 'ArrowRight':
                    activeObjects.forEach(object => object.set({ left: object.left + 1 }));
                    break;
                default:
                    break;
            };

            mnemoscheme.renderAll();
        }
    };

    const actionChoiseElement = (event) => {
        if (['Delete', 'KeyC', 'KeyV'].includes(event.code) && mnemoscheme) {
            const activeObjects = mnemoscheme.getActiveObjects();

            switch (event.code) {
                case 'Delete':
                    activeObjects.forEach(object => mnemoscheme.remove(object));
                    break;
                case 'KeyC':
                    mnemoscheme.getActiveObject().clone(function (cloned) {
                        copiedObject = cloned;
                    });
                    break;
                case 'KeyV':
                    if (copiedObject) pasteObject(copiedObject);
                    break;
                default:
                    break;
            };

            mnemoscheme.renderAll();
        }
    };

    const pasteObject = (copiedObject) => {
        copiedObject.clone(function (clonedObj) {
            mnemoscheme.discardActiveObject();

            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });

            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = mnemoscheme;
                clonedObj.forEachObject(function (obj) {
                    mnemoscheme.add(obj);
                });
                clonedObj.setCoords();
            } else {
                mnemoscheme.add(clonedObj);
            }

            copiedObject.top += 10;
            copiedObject.left += 10;
            mnemoscheme.setActiveObject(clonedObj);
            mnemoscheme.requestRenderAll();
        });
    };

    useEffect(() => {
        mnemoscheme?.on('mouse:wheel', zoomMnemoscheme);

        return mnemoscheme?.on('mouse:wheel', zoomMnemoscheme);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    useEffect(() => {
        mnemoscheme?.on('mouse:down', grabCanvas);

        return mnemoscheme?.on('mouse:down', grabCanvas);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    useEffect(() => {
        mnemoscheme?.on('mouse:move', moveCanvas);

        return mnemoscheme?.on('mouse:move', moveCanvas);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    useEffect(() => {
        mnemoscheme?.on('mouse:up', letGoCanvas);

        return mnemoscheme?.on('mouse:up', letGoCanvas);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    useEffect(() => {
        document.addEventListener('keydown', moveChoiseElement);

        return document.addEventListener('keydown', moveChoiseElement);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    useEffect(() => {
        document.addEventListener('keyup', actionChoiseElement);

        return document.addEventListener('keyup', actionChoiseElement);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    return (
        <>
            <h3 className="title">{title}</h3>

            <Space h='sm' />

            <Stepper active={activeStep} onStepClick={setActiveStep}>
                <Stepper.Step label='Форма' description='Заполнение данных'>
                    <MnemoschemeEditorForm
                        form={form}
                        addAccessIcon={addAccessIcon}
                        multiSelect={multiSelect}
                        nextStep={nextStep}
                    />
                </Stepper.Step>

                <Stepper.Step label='Мнемосхема' description='Рисование мнемосхемы'>
                    <div className='info-block__mnemoscheme-editor' >
                        <div className='info-block'>
                            <MnemoschemeEditorPanelCreateElements mnemoscheme={mnemoscheme} saveMnemoscheme={saveMnemoscheme} />
                            <MnemoschemeEditorPanelChangeElements mnemoscheme={mnemoscheme} />
                            <MnemoschemeEditorPreview setMnemoscheme={setMnemoscheme} />
                        </div>
                    </div>
                </Stepper.Step>
            </Stepper>
        </>
    );
};

//<MnemoschemeEditorPanel mnemoscheme={mnemoscheme} saveMnemoscheme={saveMnemoscheme} />