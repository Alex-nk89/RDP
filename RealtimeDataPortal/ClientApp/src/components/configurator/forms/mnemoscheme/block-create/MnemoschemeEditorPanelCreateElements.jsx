import {
    ActionIcon, Tooltip,
    fabric,
    BsSlashLg, BsFillCircleFill, BsFillSquareFill, BsTriangleFill, BsArrowDown, BsGripHorizontal, BsSave, BsFillBadgeAdFill,
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
        mnemoscheme.add(new fabric.Line([10, 20, 100, 20], { stroke: '#000', top: 50, left: 50, strokeWidth: 3 }));
    };

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
        const urlToUserImage = window.URL.createObjectURL(event.target.files[0]);
        const typeImage = event.target.files[0].type;

        if (typeImage.includes('svg')) {
            fabric.loadSVGFromURL(
                urlToUserImage,
                function (objects, options) {
                    let loadedObject = fabric.util.groupSVGElements(objects, options);

                    loadedObject.set({
                        left: 50,
                        top: 50,
                        opacity: 0.99
                    });

                    mnemoscheme.add(loadedObject);
                    console.log(options?.viewBoxWidth || options?.width || 50)
                }
            );
        }



        //ImageTracer.imageToSVG(
        //    window.URL.createObjectURL(event.target.files[0]),
        //    function (svgstr) {
        //        fabric.loadSVGFromString(
        //            svgstr,
        //            function (objects, options) {
        //                objects.forEach(object => {
        //                    if (object.type === 'path') {
        //                        //console.log(object)
        //                        const path = new fabric.Path(object.d);
        //                        path.set({
        //                            stroke: object.stroke,
        //                            fill: object.fill
        //                        });
        //                        mnemoscheme.add(path);
        //                    } else {
        //                        console.log(object.type);
        //                    }
        //                });
        //            }
        //        );
        //    },
        //    "default"
        //);


        //const image = document.createElement('svg');
        //image.src = window.URL.createObjectURL(event.target.files[0]);

        //image.onload = function () {
        //    window.URL.revokeObjectURL(this.src);
        //}

        //mnemoscheme.add(new fabric.Image(image, {
        //    top: 0,
        //    left: 0,
        //    width: 1000,
        //    height: 500,
        //    opacity: 0.99
        //}));
        //
        //var reader = new FileReader();
        //reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(image);
        //reader.readAsDataURL(selectedFile);
        //
        ////const image = new fabric.Image(selectedFile, { width: 100, height: 100 });
        //
        //mnemoscheme.add(new fabric.Image(image, {
        //    left: 100,
        //    top: 100,
        //    height: 100,
        //    width: 100,
        //    opacity: 0.85
        //}));
    }

    return (
        <div className='info-block__mnemoscheme-editor__create-block'>
            <Tooltip label='Добавить линию'>
                <ActionIcon color="indigo" size="lg" onClick={addLine}>
                    <BsSlashLg size={16} />
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
                <label htmlFor='download'>
                    <BsSave size={18} />
                </label>
                {/* <ActionIcon color="indigo" size="lg">
                    <BsSave size={18} />
                </ActionIcon> */}

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

