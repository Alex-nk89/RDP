import { Loader } from "@mantine/core";

import './appPreloader.sass';

const AppPreloader = ({ height }) => {

    return (
        <main>
            <div className={`app-preloader ${height ? 'app-preloader_height' : null}`}>
                <Loader size={70}/>
            </div>
        </main>
    )
}

export default AppPreloader;