import { Loader } from "@mantine/core";

import './appPreloader.sass';

const AppPreloader = ({ height }) => {

    return (
            <div className='app-preloader' style={{ height: height}}>
                <Loader size={70}/>
            </div>
    )
}

export default AppPreloader;