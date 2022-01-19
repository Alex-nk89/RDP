import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';

import './errorsPage.sass';

const ErrorsPage = ({ statusCode, statusText, message, height }) => {

    return (
        <div className='errors-page' style={{ height: height}}>
            <h1>{statusCode}</h1>
            <h2>{statusText}.</h2>
            <p>{message}</p>
            <Link to="/"><Button>На главную</Button></Link>
        </div>
    )
}

export default ErrorsPage;