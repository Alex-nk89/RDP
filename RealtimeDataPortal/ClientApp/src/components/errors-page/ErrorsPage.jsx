import { Button } from '@mantine/core';

import './errorsPage.sass';

const ErrorsPage = ({ statusCode, statusText, message }) => {
    return <main>
        <div className="errors-page">
            <h1>{statusCode}</h1>
            <h2>{statusText}.</h2>
            <p>{message}</p>
            <Button>На главную</Button>
        </div>
    </main>
}

export default ErrorsPage;