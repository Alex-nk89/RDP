import {
    ActionIcon, Tooltip,
    fabric,
    BsSlashLg, BsFillCircleFill, BsFillSquareFill, BsTriangleFill, BsArrowDown, BsGripHorizontal, BsSave,
    BsFillBadgeAdFill, BsFillFileEarmarkImageFill, BsWawyLine,
    attributesInputs
} from "..";
import ImageTracer from 'imagetracerjs';

export const MnemoschemeEditorPanelCreateElements = ({ mnemoscheme, saveMnemoscheme }) => {

    const figureAttributes = { fill: '#fff', stroke: '#000', width: 50, height: 50, top: 50, left: 50 };

    const figures = {
        line: { ...attributesInputs },
        rectangle: { ...figureAttributes },
        circle: { radius: 25, ...figureAttributes },
        triangle: { ...figureAttributes },
    };

    const addLine = () => {
        mnemoscheme.add(new fabric.Line([10, 20, 100, 20],
            { stroke: '#000', top: 50, left: 50, strokeWidth: 3 }));
    };

    const addWawyLine = () => {
        mnemoscheme.add(new fabric.Path(`M 8 1 Q 14 5 8 8 Q 0 12 8 16 Q 9 16 8 15 Q 2 12 8 9 Q 16 5 8 0 Q 7 0 8 1`,
            { top: 50, left: 50, fill: '#000' }));
    }

    const addArrow = () => {
        mnemoscheme.add(new fabric.Path(`M 8 1 a 0.5 0.5 0 0 1 0.5 0.5 v 11.793 l 3.146 -3.147 a 0.5 0.5 0 0 
            1 0.708 0.708 l -4 4 a 0.5 0.5 0 0 1 -0.708 0 l -4 -4 a 0.5 0.5 0 0 1 0.708 
            -0.708 L 7.5 13.293 V 1.5 A 0.5 0.5 0 0 1 8 1 Z`, { stroke: '#000', strokeWidth: 1, top: 50, left: 50 }));
    };

    const addCircle = () => {
        mnemoscheme.add(new fabric.Circle(figures.circle));
    };

    const addTriangle = () => {
        mnemoscheme.add(new fabric.Triangle(figures.triangle));
    };

    const addRectangle = () => {
        mnemoscheme.add(new fabric.Rect({ ...figures.rectangle }));
    };

    const addTag = () => {
        const tag = new fabric.Text('text', { fontSize: 14, fontFamily: 'system-ui' });

        tag.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    productId: this.productId,
                    tagId: this.tagId,
                    tagName: this.tagName,
                    round: this.round,
                    isAutomaticColorSelection: this.isAutomaticColorSelection
                });
            };
        })(tag.toObject);

        mnemoscheme.add(tag);
    };

    const selectImage = async (event) => {
        // Для преобразования SVG-изображения используется встроенные в библиотеку fabricjs средства,
        // для остальных изображений - библиотека imagetracer
        const urlToUserImage = window.URL.createObjectURL(event.target?.files[0]);
        const typeImage = event.target.files[0]?.type;

        const addObjectsFromImage = (objects) => {
            objects.forEach(object => {
                if (object.type === 'path') {
                    mnemoscheme.add(new fabric.Path(object.d, { ...object }));
                }
            });
        };

        if (typeImage.includes('svg')) {
            fabric.loadSVGFromURL(urlToUserImage, addObjectsFromImage);
        } else {
            ImageTracer.imageToSVG(
                urlToUserImage,
                function (svgString) {
                    fabric.loadSVGFromString(svgString, addObjectsFromImage);
                });
        }

        event.target.value = null;
    }

    return (
        <div className='info-block__mnemoscheme-editor__create-block'>
            <Tooltip label='Добавить линию'>
                <ActionIcon color="indigo" size="lg" onClick={addLine}>
                    <BsSlashLg size={16} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить волнистую линию'>
                <ActionIcon color="indigo" size="lg" onClick={addWawyLine}>
                    <BsWawyLine size={16} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить стрелку'>
                <ActionIcon color="indigo" size="lg" onClick={addArrow}>
                    <BsArrowDown size={16} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить круг'>
                <ActionIcon color="indigo" size="lg" onClick={addCircle}>
                    <BsFillCircleFill size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить треугольник'>
                <ActionIcon color="indigo" size="lg" onClick={addTriangle}>
                    <BsTriangleFill size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить прямоугольник'>
                <ActionIcon color="indigo" size="lg" onClick={addRectangle}>
                    <BsFillSquareFill size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить текст'>
                <ActionIcon color='indigo' size='lg' onClick={addTag}>
                    <BsFillBadgeAdFill size={18} />
                </ActionIcon>
            </Tooltip>


            <Tooltip label='Добавить изображение'>

                <ActionIcon color="indigo" size="lg">
                    <label htmlFor='download'>
                        <BsFillFileEarmarkImageFill size={18} />
                    </label>
                </ActionIcon>

                <input id='download' type='file' style={{ display: 'none' }} onChange={selectImage} accept='image/*' />
            </Tooltip>


            <BsGripHorizontal size={24} style={{ color: '#aab3ba' }} />

            <Tooltip label='Сохранить'>
                <ActionIcon color="indigo" size="lg" onClick={saveMnemoscheme}>
                    <BsSave size={18} />
                </ActionIcon>
            </Tooltip>
        </div>
    )
};

