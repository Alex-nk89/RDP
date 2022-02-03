import {
    useState, useEffect, useRef, attributesInputs, TextInput, Space, InputWrapper, Group, ActionIcon, settingsAddRemoveIcon,
    IoRemove, IoAdd, Parameter
} from '../../index';

const AddChangeProduct = ({ operation }) => {
    const productNameRef = useRef(null);

    const parameter = {
        //idProduct: 0,
        tags: [{
            id: 0,
            idTag: "",
            tagName: ""
        }],
        //idParameterGroup: 0,
        //errorTag: "",
        position: { value: '', error: '' },
        //errorPosition: "",
        round: { value: 0, error: '' },
        showLimits: false
    };

    const [nameProduct, setNameProduct] = useState({ value: '', error: '' });
    const [parameters, setParameters] = useState([parameter]);

    function searchProduct(event) {
        const nameProduct = event.target.value;

        setNameProduct({ value: nameProduct, error: '' });
    };

    const addParameter = () => {
        setParameters([...parameters, parameter]);
    };

    const removeParameter = () => {
        if (parameters.length > 1) {
            parameters.pop();
            setParameters([...parameters]);
        }
    };

    const enterData = (id, parameter) => {
        parameters[id] = { ...parameter };
        setParameters([...parameters]);
    };

    useEffect(() => {
        productNameRef.current.focus();

        setNameProduct({ value: '', error: '' });
        setParameters([parameter]);
        //eslint-disable-next-line
    }, [operation])

    return (
        <div className="info-block info-block__form">
            <form>
                <TextInput
                    {...attributesInputs}
                    {...nameProduct}
                    label='Наименование'
                    placeholder='Введите наименование'
                    ref={productNameRef}
                    /* value={nameProduct.value}
                    error={nameProduct.error} */
                    onChange={searchProduct}
                    onFocus={searchProduct} />

                <Space h="md" />

                <InputWrapper label='Количество параметров'>
                    <Group>
                        <ActionIcon color='red' {...settingsAddRemoveIcon} onClick={removeParameter}>
                            <IoRemove />
                        </ActionIcon>
                        <span>{parameters.length}</span>
                        <ActionIcon color='blue' {...settingsAddRemoveIcon} onClick={addParameter}>
                            <IoAdd />
                        </ActionIcon>
                    </Group>
                </InputWrapper>

                {parameters.map((parameter, index) =>
                    <Parameter key={index} number={index} parameter={parameter} enterData={enterData} />)}
            </form>
        </div>
    );
};

export default AddChangeProduct;