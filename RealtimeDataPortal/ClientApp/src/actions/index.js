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

export const toogleConfigMode = () => {
    return {
        type: 'TOOGLE_CONFIG_MODE'
    }
};

export const toogleAdminMode = () => {
    return {
        type: 'TOOGLE_ADMIN_MODE'
    }
};

export const toogleNavbarState = () => {
    return {
        type: 'TOOGLE_NAVBAR_STATE'
    }
};

export const updateNavbar = () => {
    return {
        type: 'UPDATE_NAVBAR'
    }
};

export const initialStateGraphics = () => {
    return {
        type: 'INITIAL_STATE_GRAPHICS'
    }
};

export const getAttributesForGraphic = (attributesGraphic) => {
    return {
        type: 'FETCHED_ATTRIBUTES_GRAPHIC',
        payload: attributesGraphic
    }
};

export const fetchedAttributesGraphicError = () => {
    return {
        type: 'FETCHED_ATTRIBUTES_GRAPHIC_ERROR'
    }
};

export const toogleIsScale = () => {
    return {
        type: 'TOOGLE_IS_SCALE'
    }
};

export const toogleIsVisibleTable = () => {
    return {
        type: 'TOOGLE_IS_VISIBLE_TABLE'
    }
};

export const setActiveTab = (activeTab) => {
    return {
        type: 'SET_ACTIVE_TAB',
        payload: activeTab
    }
};