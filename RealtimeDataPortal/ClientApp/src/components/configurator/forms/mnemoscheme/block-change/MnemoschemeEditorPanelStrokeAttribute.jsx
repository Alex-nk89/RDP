import {
    Input, NumberInput, Tooltip,
    BsBorderWidth, BsArrow90DegRight, BsArrow90DegUp, BsBorderStyle
} from '..';

export const MnemoschemeEditorPanelStrokeAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {

    const changeStrokeWidth = (strokeWidth) => {
        if (strokeWidth >= 0) {
            setElementAttributes({ ...elementAttributes, strokeWidth });
            mnemoscheme?._activeObject.set({ strokeWidth });
            mnemoscheme.renderAll();
        }
    };

    const changeRXElement = (rxElement) => {
        if (rxElement >= 0) {
            setElementAttributes({ ...elementAttributes, rxElement });
            mnemoscheme?._activeObject.set({ rx: rxElement });
            mnemoscheme.renderAll();
        }
    };

    const changeRYElement = (ryElement) => {
        if (ryElement >= 0) {
            setElementAttributes({ ...elementAttributes, ryElement });
            mnemoscheme?._activeObject.set({ ry: ryElement });
            mnemoscheme.renderAll();
        }
    };

    const changeStrokeDashArray = (event) => {
        setElementAttributes({ ...elementAttributes, strokeDashArray: event.target.value });
        mnemoscheme?._activeObject.set({ strokeDashArray: event.target.value.split(' ') });
        mnemoscheme.renderAll();
    };

    const selectStrokeWidth = ['rect', 'line', 'circle', 'triangle', 'path'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить ширину обводки'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsBorderWidth size={18} color='#5c5c5c' />}
                value={elementAttributes.strokeWidth}
                onChange={changeStrokeWidth}
            />
        </Tooltip>
    ) : null;

    const selectRXElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Скругление углов по оси X'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrow90DegRight size={18} color='#5c5c5c' />}
                value={elementAttributes.rxElement}
                onChange={changeRXElement}
            />
        </Tooltip>
    ) : null;

    const selectRYElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Скругление углов по оси Y'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrow90DegUp size={18} color='#5c5c5c' />}
                value={elementAttributes.ryElement}
                onChange={changeRYElement}
            />
        </Tooltip>
    ) : null;

    const selectStrokeDashArray = ['rect', 'line', 'circle', 'triangle', 'path'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Обводка пунктирной линией'>
            <Input
                size='xs'
                variant='filled'
                icon={<BsBorderStyle size={18} color='#5c5c5c' />}
                value={elementAttributes.strokeDashArray}
                onChange={changeStrokeDashArray}
            />
        </Tooltip>
    ) : null;

    return (
        <>
            {selectStrokeWidth}
            {selectStrokeDashArray}
            {selectRXElement}
            {selectRYElement}
        </>
    );
}