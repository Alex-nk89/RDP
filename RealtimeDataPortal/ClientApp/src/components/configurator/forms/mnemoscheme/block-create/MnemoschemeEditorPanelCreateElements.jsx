import {
    useState, useForm,
    ActionIcon, Button, Loader, Popover, TextInput, Tooltip,
    fabric,
    BsSlashLg, BsFillCircleFill, BsFillSquareFill, BsTriangleFill, BsArrowDown, BsGripHorizontal, IoSend,
    BsFillBadgeAdFill, BsFillFileEarmarkImageFill, BsWawyLine, BsSemicircle, BsFillPlusSquareFill, BsFillSaveFill,
    BsListOl,
    attributesInputs,
    useNotification, useRequest
} from "..";
import ImageTracer from 'imagetracerjs';
import { BsTrash } from "react-icons/bs";

export const MnemoschemeEditorPanelCreateElements = ({ mnemoscheme, saveMnemoscheme }) => {
    const { show } = useNotification();
    const { request } = useRequest();

    const [openFormSavingTemplate, setOpenFormSavingTemplate] = useState(false);
    const [isOpenedListTemplates, setIsOpenedListTemplates] = useState(false);

    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [sendingTemplate, setSendingTemplate] = useState(false);

    const [listTemplates, setListTemplates] = useState([]);

    const form = useForm({
        initialValues: {
            name: '',
            template: ''
        },
        validationRules: {
            name: value => value.trim().length > 0
        },
        errorMessages: {
            name: 'Наименование должно содержать хотя бы один символ'
        }
    });

    const figureAttributes = { fill: 'rgba(255, 255, 255, 1)', stroke: 'rgba(0, 0, 0, 1)', width: 50, height: 50, top: 50, left: 50 };

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
        mnemoscheme.add(new fabric.Path(`M 8 1 Q 14 5 8 8 Q 0 12 8 16 Q 9 16 8 15 Q 2 12 8 9 Q 16 5 8 0 Q 7 0 8 1z`,
            { top: 50, left: 50, fill: 'rgba(0, 0, 0, 1)', stroke: 'rgba(0, 0, 0, 1)' }));
    }

    const addArrow = () => {
        mnemoscheme.add(new fabric.Path(`M 8 1 a 0.5 0.5 0 0 1 0.5 0.5 v 11.793 l 3.146 -3.147 a 0.5 0.5 0 0 
            1 0.708 0.708 l -4 4 a 0.5 0.5 0 0 1 -0.708 0 l -4 -4 a 0.5 0.5 0 0 1 0.708 
            -0.708 L 7.5 13.293 V 1.5 A 0.5 0.5 0 0 1 8 1 Z`, { stroke: 'rgba(0, 0, 0, 1)', strokeWidth: 1, top: 50, left: 50 }));
    };

    const addCircle = () => {
        mnemoscheme.add(new fabric.Circle(figures.circle));
    };

    const addSemicircle = () => {
        mnemoscheme.add(new fabric.Path(`M 0 8 A 1 1 0 0 1 16 8 A 1 1 0 0 1 15 8 A 1 1 0 0 0 1 8 Q 1 8 1 8 A 1 1 0 0 1 0 8`,
            { top: 50, left: 50, fill: 'rgba(0, 0, 0, 1)' }));
    }

    const addTriangle = () => {
        mnemoscheme.add(new fabric.Triangle(figures.triangle));
    };

    const addRectangle = () => {
        mnemoscheme.add(new fabric.Rect({ ...figures.rectangle }));
    };

    const addTag = () => {
        const tag = new fabric.Text('text', { fontSize: 14, fontFamily: 'system-ui', fontWeight: 400 });

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

    const addSelectedTemplate = (event) => {
        const id = event.target.dataset.templateid;

        request(`GetMnemoschemeTemplates?id=${id}`)
            .then((template) => {
                const objects = JSON.parse(template[0].templateContain);

                const maxLeft = objects.length > 1
                    ? Math.max.apply(null, objects.map(object => Math.abs(object.left)))
                    : objects[0].left * -1;
                const maxTop = objects.length > 1
                    ? Math.max.apply(null, objects.map(object => Math.abs(object.top)))
                    : objects[0].top * -1;

                objects.forEach(object => {
                    let newObject = null;

                    switch (object.type) {
                        case 'line':
                            newObject = new fabric.Line([object.x1, object.y1, object.x2, object.y2], { ...object });
                            break;
                        case 'path':
                            newObject = new fabric.Path(object.path.flatMap(x => x).join(' '), { ...object })
                            break;
                        case 'circle':
                            newObject = new fabric.Circle({ ...object });
                            break;
                        case 'triangle':
                            newObject = new fabric.Triangle({ ...object });
                            break;
                        case 'rect':
                            newObject = new fabric.Rect({ ...object });
                            break;
                        case 'text':
                            console.log(object)
                            newObject = new fabric.Text('text', { ...object });
                            break;
                        default: break;
                    }

                    // Сдвиг вставляемого объекта в левую верхнюю часть холста
                    newObject.set({ left: object.left + maxLeft + 20, top: object.top + maxTop + 20 });
                    mnemoscheme.add(newObject);
                    setIsOpenedListTemplates(false);
                });
            })
            .catch(message => show('error', message));
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
    };

    const getTemplate = () => {
        const selectedObjects = mnemoscheme.getActiveObjects();
        setListTemplates([]);

        if (selectedObjects.length > 0) {
            form.values.template = JSON.stringify(selectedObjects);

            // Ограничение длины из-за ограничений БД длины содержимого ячейки
            if (form.values.template.length < 8000) {
                setOpenFormSavingTemplate(true);
            } else {
                show('error', 'Рамер шаблона превышает допустимую длину');
            }
        } else {
            show('warning', 'Не выбран ни один объект!');
        }
    };

    const closeTemplateForm = () => setOpenFormSavingTemplate(false);

    const saveTemplate = (values) => {
        setSendingTemplate(true);

        request(
            'SaveMnemoschemeTemplates',
            'POST',
            JSON.stringify({
                templateId: 0,
                templateName: values?.name,
                templateContain: values.template
            }))
            .then(message => show('success', message.success))
            .catch(message => show('error', message))
            .finally(() => {
                setOpenFormSavingTemplate(false);
                setSendingTemplate(false);
                form.reset();
            });
    };

    const removeTemplate = (event) => {
        const id = event.target.dataset.templateid;
        event.stopPropagation();

        request(`RemoveMnemoschemeTemplates?id=${id}`)
            .then(message => show('success', message.success))
            .catch(message => show('error', message))
            .finally(() => {
                setIsOpenedListTemplates(false);
                setListTemplates([]);
            });
    };

    const templateForm = (
        <div className='info-block__mnemoscheme-editor__create-block__form-template'>
            <form onSubmit={form.onSubmit(values => saveTemplate(values))}>
                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('name')}
                    label='Наименование шаблона'
                    placeholder='Введите наименование'
                    size='xs'
                />

                <Button variant='white' size='xs' type='submit'>
                    <IoSend size={16} />
                </Button>
            </form>
        </div>
    );

    const openListTemplates = () => {
        setLoadingTemplates(true);

        request(`GetMnemoschemeTemplates`)
            .then(listTemplates => setListTemplates(listTemplates))
            .catch(message => show('error', message))
            .finally(() => {
                setIsOpenedListTemplates(true);
                setLoadingTemplates(false);
            });
    };
    const closeListTemplates = () => setIsOpenedListTemplates(false);

    const divListTemplates = (
        <ul className='list'>
            {listTemplates.map(template => (
                <li key={template.templateId} data-templateid={template.templateId} onClick={addSelectedTemplate}>
                    <span data-templateid={template.templateId} >{template.templateName}</span>

                    <ActionIcon color='red' data-templateid={template.templateId} onClick={removeTemplate}>
                        <BsTrash data-templateid={template.templateId} />
                    </ActionIcon>
                </li>
            ))}
        </ul>);

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

            <Tooltip label='Добавить полукруг'>
                <ActionIcon color="indigo" size="lg" onClick={addSemicircle}>
                    <BsSemicircle size={18} />
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

            <Popover
                opened={isOpenedListTemplates}
                onClose={closeListTemplates}
                position='right'
                width={250}
                target={loadingTemplates
                    ? <Loader size={16} />
                    : <Tooltip label='Добавить шаблон'>
                        <ActionIcon color='indigo' size='lg' onClick={openListTemplates}>
                            <BsListOl size={18} />
                        </ActionIcon>
                    </Tooltip>
                }
            >
                {divListTemplates}
            </Popover>

            <BsGripHorizontal size={24} style={{ color: '#aab3ba' }} />

            <Popover
                opened={openFormSavingTemplate}
                onClose={closeTemplateForm}
                position='right'
                width={320}
                target={sendingTemplate
                    ? <Loader size={16} />
                    : <Tooltip label='Сохранить шаблон'>
                        <ActionIcon color="indigo" size="lg" onClick={getTemplate}>
                            <BsFillPlusSquareFill size={18} />
                        </ActionIcon>
                    </Tooltip>
                }
            >
                {templateForm}
            </Popover>

            <Tooltip label='Сохранить'>
                <ActionIcon color="indigo" size="lg" onClick={saveMnemoscheme}>
                    <BsFillSaveFill size={18} />
                </ActionIcon>
            </Tooltip>
        </div>
    )
};

