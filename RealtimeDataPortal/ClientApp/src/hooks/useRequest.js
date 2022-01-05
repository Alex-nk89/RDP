import { useState, useCallback } from 'react';

export const useRequest = () => {
    const [proccess, setProccess] = useState('loading');
    const [error, setError] = useState(null);

    const request = useCallback(
        async (controllerMethod, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {

            // Так как приложении при публикации кладется в папку, а не в корень
            const url = window.location.href.includes("localhost") ?
                `rdp/${controllerMethod}` :
                `${window.location.origin}/RealtimeDataPortal/rdp/${controllerMethod}`;

            //setProccess('loading');

            try {
                const response = await fetch(url, { method, body, headers});
                const data = await response.json();

                if(!response.ok)
                    throw new Error(response.json());

                return data;
            } catch (e) {
                setProccess('error');
                setError(e.message)
            }
        }, []);

        return { proccess, setProccess, error, request };
}