import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';

import './errorsPage.sass';

const ErrorsPage = ({ statusCode, statusText, message, nonFullHeight }) => {
    const height = nonFullHeight ? 'non-full-height' : null;

    return <main>
        <div className={`errors-page errors-page_${height}`}>
            <h1>{statusCode}</h1>
            <h2>{statusText}.</h2>
            <p>{message}</p>
            <Link to="/"><Button>На главную</Button></Link>
        </div>
    </main>
}

export default ErrorsPage;