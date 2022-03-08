export const userInitialize = (user) => {
    return {
        type: 'USER_INITIALIZE',
        payload: user
    }
};

export const userFetching = () => {
    return {
        type: 'USER_FETCHING'
    }
};

export const userFetchingError = () => {
    return {
        type: 'USER_FETCHING_ERROR'
    }
};