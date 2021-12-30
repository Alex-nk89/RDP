import { useState, useCallback } from 'react';

export const useRequest = () => {
    const [proccess, setProccess] = useState('waiting');
    const [error, setError] = useState(null);

    const request = useCallback(
        async (controllerMethod, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {

            // Так как приложении при публикации кладется в папку, а не в корень
            const url = window.location.href.includes("localhost") ?
                `rdp/${controllerMethod}` :
                `${window.location.origin}/RealtimeDataPortal/rdp/${controllerMethod}`;

            setProccess('loading');

            try {
                const response = await fetch(url);
                const data = await response.json();

                if(!response.ok)
                    throw new Error(response.json());

                setProccess('confirmed');
                return data;
            } catch (e) {
                setProccess('error');
                setError(e.message)
            }
        }, []);

        return { proccess, error, request };
}