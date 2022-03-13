const initialState = {
    user: {},
    userFetchingStatus: 'idle'
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_INITIALIZE':
            return {
                ...state,
                user: action.payload,
                userFetchingStatus: 'confirmed'
            };
        case 'USER_FETCHING':
            return {
                ...state,
                userFetchingStatus: 'loading'
            };
        case 'USER_FETCHING_ERROR':
            return {
                ...state,
                userFetchingStatus: 'error'
            }
        default:
            return state;
    }
};

export default user;