import { useSelector } from "react-redux";

const HeaderGraphics = () => {
    const name = useSelector(state => state.graphics.attributesGraphic[0].name);

    return (
        <h4 className='title'>{name}</h4>
    )
}

export default HeaderGraphics;