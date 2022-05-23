import {
    useState, useForm, useSelector, useNotification, useRequest,
    ActionIcon, Button, Loader, Popover, TextInput, Tooltip,
    fabric, attributesInputs,
    BsSlashLg, BsFillCircleFill, BsFillSquareFill, BsTriangleFill, BsArrowDown, IoSend,
    BsFillBadgeAdFill, BsFillFileEarmarkImageFill, BsWawyLine, BsSemicircle, BsFillPlusSquareFill, BsFillSaveFill,
    BsListOl
} from "..";
import ImageTracer from 'imagetracerjs';
import { BsTrash } from "react-icons/bs";

export const MnemoschemeEditorPanelCreateElements = ({ mnemoscheme, saveMnemoscheme }) => {
    const { show } = useNotification();
    const { request } = useRequest();

    const user = useSelector(state => state.user.user);
    const disabledButton = user?.isConfigurator ? false : true;

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

    const figureAttributes = { fill: 'rgba(255, 255, 255, 1)', stroke: 'rgba(0, 0, 0, 1)', width: 50, height: 50 };

    const getCoords = () => {
        return {
            left: mnemoscheme.getVpCenter().x - mnemoscheme.getCenter().left / 2,
            top: mnemoscheme.getVpCenter().y - mnemoscheme.getCenter().top / 2
        }
    }

    const addLine = () => {
        mnemoscheme.add(new fabric.Line([10, 20, 100, 20],
            { stroke: '#000', ...getCoords(), strokeWidth: 2 }));
    };

    const addWawyLine = () => {
        mnemoscheme.add(new fabric.Path(`M 8 1 Q 14 5 8 8 Q 0 12 8 16 Q 9 16 8 15 Q 2 12 8 9 Q 16 5 8 0 Q 7 0 8 1z`,
            { ...getCoords(), fill: 'rgba(0, 0, 0, 1)', stroke: 'rgba(0, 0, 0, 1)' }));
    }

    const addArrow = () => {
        mnemoscheme.add(new fabric.Path(`M 8 1 a 0.5 0.5 0 0 1 0.5 0.5 v 11.793 l 3.146 -3.147 a 0.5 0.5 0 0 
            1 0.708 0.708 l -4 4 a 0.5 0.5 0 0 1 -0.708 0 l -4 -4 a 0.5 0.5 0 0 1 0.708 
            -0.708 L 7.5 13.293 V 1.5 A 0.5 0.5 0 0 1 8 1 Z`, { stroke: 'rgba(0, 0, 0, 1)', strokeWidth: 1, ...getCoords() }));
    };

    const addCircle = () => {
        mnemoscheme.add(new fabric.Circle({ radius: 20, ...getCoords(), ...figureAttributes }));
    };

    const addSemicircle = () => {
        mnemoscheme.add(new fabric.Path(`M 0 8 A 1 1 0 0 1 16 8 A 1 1 0 0 1 15 8 A 1 1 0 0 0 1 8 Q 1 8 1 8 A 1 1 0 0 1 0 8`,
            { ...getCoords(), fill: 'rgba(0, 0, 0, 1)' }));
    }

    const addTriangle = () => {
        mnemoscheme.add(new fabric.Triangle({ ...getCoords(), ...figureAttributes }));
    };

    const addRectangle = () => {
        mnemoscheme.add(new fabric.Rect({ ...getCoords(), ...figureAttributes }));
    };

    const addTag = () => {
        const tag = new fabric.Text('text', {
            fontSize: 14, fontFamily: 'system-ui',
            fontWeight: 400, ...getCoords(), strokeWidth: 0
        });

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
                    newObject.set({ ...getCoords() });
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
            {listTemplates.map(({ templateId, templateName }) => (
                <li key={templateId} data-templateid={templateId} onClick={addSelectedTemplate}>
                    <span data-templateid={templateId} >{templateName}</span>

                    <ActionIcon color='red' data-templateid={templateId} onClick={removeTemplate}>
                        <BsTrash data-templateid={templateId} />
                    </ActionIcon>
                </li>
            ))}
        </ul>);

    return (
        <div className='info-block__mnemoscheme-editor__settings__create-block'>
            <Tooltip label='Добавить линию' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact onClick={addLine} leftIcon={<BsSlashLg size={14} />}>
                    Линия
                </Button>
            </Tooltip>

            <Tooltip label='Добавить волнистую линию' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact onClick={addWawyLine} leftIcon={<BsWawyLine size={14} />}>
                    Волна
                </Button>
            </Tooltip>

            <Tooltip label='Добавить стрелку' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsArrowDown size={14} />} onClick={addArrow}>
                    Стрелка
                </Button>
            </Tooltip>

            <Tooltip label='Добавить круг' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsFillCircleFill size={14} />} onClick={addCircle}>
                    Круг
                </Button>
            </Tooltip>

            <Tooltip label='Добавить полукруг' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsSemicircle size={14} />} onClick={addSemicircle}>
                    Полукруг
                </Button>
            </Tooltip>

            <Tooltip label='Добавить треугольник' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsTriangleFill size={14} />} onClick={addTriangle}>
                    Треугольник
                </Button>
            </Tooltip>

            <Tooltip label='Добавить квадрат' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsFillSquareFill size={14} />} onClick={addRectangle}>
                    Квадрат
                </Button>
            </Tooltip>

            <Tooltip label='Добавить текст' openDelay={1000}>
                <Button color='indigo' size="xs" variant='light' compact leftIcon={<BsFillBadgeAdFill size={14} />} onClick={addTag}>
                    Текст
                </Button>
            </Tooltip>

            <Tooltip label='Добавить изображение' openDelay={1000}>

                <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsFillFileEarmarkImageFill size={14} />} >
                    <label htmlFor='download'>
                        Изображение
                    </label>
                </Button>

                <input id='download' type='file' style={{ display: 'none' }} onChange={selectImage} accept='image/*' />
            </Tooltip>

            <Popover
                opened={isOpenedListTemplates}
                onClose={closeListTemplates}
                position='bottom'
                width={250}
                target={loadingTemplates
                    ? <Loader size={16} />
                    : <Tooltip label='Добавить шаблон' openDelay={1000}>
                        <Button color='indigo' size="xs" variant='light' compact leftIcon={<BsListOl size={14} />} onClick={openListTemplates}>
                            Шаблоны
                        </Button>
                    </Tooltip>
                }
            >
                {divListTemplates}
            </Popover>

            <Popover
                opened={openFormSavingTemplate}
                onClose={closeTemplateForm}
                position='right'
                width={320}
                target={sendingTemplate
                    ? <Loader size={16} />
                    : <Tooltip label='Сохранить шаблон' openDelay={1000}>
                        <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsFillPlusSquareFill size={14} />} onClick={getTemplate} disabled={disabledButton}>
                            + шаблон
                        </Button>
                    </Tooltip>
                }
            >
                {templateForm}
            </Popover>

            <Tooltip label='Сохранить' openDelay={1000}>
                <Button color="indigo" size="xs" variant='light' compact leftIcon={<BsFillSaveFill size={14} />} onClick={saveMnemoscheme} disabled={disabledButton}>
                    Сохранить
                </Button>
            </Tooltip>
        </div>
    )
};

