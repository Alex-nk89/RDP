import { Loader } from "@mantine/core";

import './appPreloader.sass';

const AppPreloader = ({ height }) => {

    return (
            <div className={`app-preloader ${height ? 'app-preloader_height' : null}`}>
                <Loader size={70}/>
            </div>
    )
}

export default AppPreloader;