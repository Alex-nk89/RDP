const initialState = {
    operation: '',
    componentInfo: {},
    statusFetchingComponentInfo: 'idle'
};

const configurator = (state = initialState, action) => {
    switch (action.type) {
        case 'OPERATION_INITIALIZE':
            return {
                ...state,
                operation: action.payload
            }
        case 'COMPONENT_INFO_FETCHING':
            return {
                ...state,
                statusFetchingComponentInfo: 'loading'
            }
        case 'INITIALIZE_COMPONENT_INFO':
            return {
                ...state,
                statusFetchingComponentInfo: 'idle',
                componentInfo: action.payload
            }
        default:
            return state;
    }
};

export default configurator;