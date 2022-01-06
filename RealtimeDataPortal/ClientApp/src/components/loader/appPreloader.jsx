import { Loader } from "@mantine/core";

import './appPreloader.sass';

const AppPreloader = () => {

    return (
        <main>
            <div className="app-preloader">
                <Loader size={70}/>
            </div>
        </main>
    )
}

export default AppPreloader;