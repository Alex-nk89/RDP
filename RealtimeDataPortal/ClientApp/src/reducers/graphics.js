const initialState = {
    attributesGraphic: {},
    tabsNames: [],
    statusFetchingGraphic: 'idle',
    activeTab: 0,
    isScale: false,
    isVisibleTable: true
};

const graphics = (state = initialState, action) => {
    switch (action.type) {
        case 'INITIAL_STATE_GRAPHICS':
            return {
                ...state,
                statusFetchingGraphic: 'loading'
            };
        case 'FETCHED_ATTRIBUTES_GRAPHIC':
            return {
                ...state,
                attributesGraphic: action.payload,
                tabsNames: Array.from(new Set(action.payload.map(item => item.typeName))),
                statusFetchingGraphic: 'confirmed'
            };
        case 'FETCHED_ATTRIBUTES_GRAPHIC_ERROR':
            return {
                ...state,
                statusFetchingGraphic: 'error'
            };
        case 'TOOGLE_IS_SCALE':
            return {
                ...state,
                isScale: !state.isScale
            };
        case 'TOOGLE_IS_VISIBLE_TABLE':
            return {
                ...state,
                isVisibleTable: !state.isVisibleTable
            };
        case 'SET_ACTIVE_TAB':
            return {
                ...state,
                activeTab: action.payload
            }
        default:
            return state;
    }
};

export default graphics;