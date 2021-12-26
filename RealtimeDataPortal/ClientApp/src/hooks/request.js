import { useState, useCallback } from 'react';

export const useRequest = () => {
    const [proccess, setProccess] = useState('waiting');

    const request = useCallback(
        async (controllerMethod, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {

            // Так как приложении при публикации кладется в папку, а не в корень
            const url = window.location.href.includes("localhost") ?
                `${window.location.origin}/rdp/${controllerMethod}` :
                `${window.location.origin}/RealtimeDataPortal/rdp/${controllerMethod}`;

            setProccess('loading');

            try {

            } catch {

            }
        }, []);
}